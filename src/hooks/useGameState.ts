import { useCallback, useState } from 'react';
import randomElement from '../lib/randomElement';
import removeDiacritics from '../lib/removeDiacritics';
import words, { getValidWord } from '../lib/words';

export interface GameState {
  status: GameStatus;
  word: string;
  charsStatus: Record<string, CellStatus>;
  table: TableState;
  error?: string;
}

export enum GameStatus {
  playing,
  completed,
  failed,
}

export interface TableState {
  rows: (CellState | undefined)[][];
  activeRow: number;
  activeCell: number;
}

export interface CellState {
  char: string;
  status?: CellStatus;
}

export enum CellStatus {
  notPresent,
  wrongPlace,
  correct,
}

const numRows = 6;
const numCells = 5;

function getInitialState(): GameState {
  return {
    status: GameStatus.completed,
    word: randomElement(words),
    charsStatus: {},
    table: {
      rows: [...Array(numRows)].map(() => [...Array(numCells)]),
      activeRow: 0,
      activeCell: 0,
    },
  };
}

export default function useGameState() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());

  const setCharAtCell = useCallback((cell: number, char: string | undefined) => {
    setGameState(gameState => {
      const {
        table: { rows, activeRow },
      } = gameState;
      const newRow = [...rows[activeRow]];
      newRow[cell] = char ? { char } : undefined;
      const newRows = [...rows];
      newRows[activeRow] = newRow;
      return {
        ...gameState,
        table: {
          ...gameState.table,
          rows: newRows,
          activeCell: char ? cell + 1 : cell,
        },
        error: undefined,
      };
    });
  }, []);

  const verifyActiveRow = useCallback(() => {
    const {
      word,
      charsStatus,
      table: { rows, activeRow },
    } = gameState;
    const entry = rows[activeRow].map(cell => cell?.char).join('');
    const validEntry = getValidWord(entry);

    if (!validEntry) {
      setGameState({
        ...gameState,
        error: 'Palavra não encontrada na lista',
      });
      return;
    }

    const remainingChars: (string | undefined)[] = removeDiacritics(word).split('');
    const newRow: CellState[] = rows[activeRow].map(cell => ({ char: cell?.char ?? '' }));

    newRow.forEach((cell, index) => {
      if (remainingChars[index] === cell.char) {
        remainingChars[index] = undefined;
        newRow[index].status = CellStatus.correct;
      }
    });

    newRow.forEach((cell, index) => {
      if (cell.status !== undefined) {
        return;
      }

      const charIndex = remainingChars.indexOf(cell.char);

      if (charIndex >= 0) {
        remainingChars[charIndex] = undefined;
      }

      cell.status =
        charIndex === -1
          ? CellStatus.notPresent
          : index === charIndex
          ? CellStatus.correct
          : CellStatus.wrongPlace;
    });

    const newCharsStatus = { ...charsStatus };
    newRow.forEach(cellState => {
      if (!cellState || !cellState.status) {
        return;
      }

      newCharsStatus[cellState.char] = Math.max(
        newCharsStatus[cellState.char] ?? CellStatus.notPresent,
        cellState.status,
      );
    });

    const complete = newRow.every(cell => cell?.status === CellStatus.correct);
    const newRows = [...gameState.table.rows];
    newRows[activeRow] = newRow;

    setGameState({
      ...gameState,
      status: complete
        ? GameStatus.completed
        : activeRow === numRows - 1
        ? GameStatus.failed
        : GameStatus.playing,
      charsStatus: newCharsStatus,
      table: {
        rows: newRows,
        activeRow: complete ? numRows : activeRow + 1,
        activeCell: 0,
      },
    });
  }, [gameState]);

  const onKeyPress = useCallback(
    (key: string) => {
      const {
        table: { activeRow, activeCell },
      } = gameState;

      if (activeCell < numCells && /^[a-z]$/.test(key)) {
        setCharAtCell(activeCell, key);
      } else if (activeCell > 0 && key === 'Backspace') {
        setCharAtCell(activeCell - 1, undefined);
      } else if (activeRow < numRows && activeCell === numCells && key === 'Enter') {
        verifyActiveRow();
      }
    },
    [gameState, setCharAtCell, verifyActiveRow],
  );

  const restart = useCallback(() => {
    setGameState(getInitialState());
  }, []);

  return { ...gameState, onKeyPress, restart };
}

import { useCallback, useEffect, useState } from 'react';
import randomElement from '../lib/randomElement';
import removeDiacritics from '../lib/removeDiacritics';
import words, { getValidWord } from '../lib/words';

export interface GameState {
  status: GameStatus;
  word: string;
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
      table: { rows, activeRow },
    } = gameState;
    const entry = rows[activeRow].map(cell => cell?.char).join('');
    const validEntry = getValidWord(entry);

    if (!validEntry) {
      setGameState({
        ...gameState,
        error: 'Palavra não encontrada',
      });
      return;
    }

    const remainingChars: (string | undefined)[] = removeDiacritics(word).split('');
    const newRow: (CellState | undefined)[] = rows[activeRow]
      .filter(cell => cell)
      .map((cell, index) => {
        if (!cell) {
          return cell;
        }

        const charIndex = remainingChars.indexOf(cell.char);

        if (charIndex >= 0) {
          remainingChars[charIndex] = undefined;
        }

        return {
          char: validEntry[index],
          status:
            charIndex === -1
              ? CellStatus.notPresent
              : index === charIndex
              ? CellStatus.correct
              : CellStatus.wrongPlace,
        };
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
      table: {
        rows: newRows,
        activeRow: complete ? numRows : activeRow + 1,
        activeCell: 0,
      },
    });
  }, [gameState]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const {
        table: { activeRow, activeCell },
      } = gameState;

      if (activeCell < numCells && /^[a-z]$/.test(event.key)) {
        setCharAtCell(activeCell, event.key);
      } else if (activeCell > 0 && event.key === 'Backspace') {
        setCharAtCell(activeCell - 1, undefined);
      } else if (activeRow < numRows && activeCell === numCells && event.key === 'Enter') {
        verifyActiveRow();
      }
    },
    [gameState, setCharAtCell, verifyActiveRow],
  );

  const restart = useCallback(() => {
    setGameState(getInitialState());
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { ...gameState, restart };
}

import update from 'immutability-helper';
import { useCallback, useState } from 'react';
import getRandomElement from '../lib/getRandomElement';
import getValidWord from '../lib/getValidWord';
import removeDiacritics from '../lib/removeDiacritics';
import words from '../lib/words';

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
    word: getRandomElement(words),
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
        table: { activeRow },
      } = gameState;

      return update(gameState, {
        table: {
          rows: {
            [activeRow]: {
              [cell]: { $set: char ? { char } : undefined },
            },
          },
          activeCell: { $set: char ? cell + 1 : cell },
        },
        error: { $set: undefined },
      });
    });
  }, []);

  const verifyActiveRow = useCallback(() => {
    const {
      word,
      charsStatus,
      table: { rows, activeRow },
    } = gameState;
    const row = rows[activeRow] as CellState[];
    const entry = row.map(cell => cell?.char).join('');
    const validEntry = getValidWord(entry);

    if (!validEntry) {
      setGameState(update(gameState, { error: { $set: 'Palavra não encontrada na lista' } }));
      return;
    }

    const remainingChars: (string | undefined)[] = removeDiacritics(word).split('');
    const newRow: CellState[] = validEntry.split('').map(char => ({ char }));

    newRow.forEach((cell, index) => {
      if (remainingChars[index] === row[index].char) {
        remainingChars[index] = undefined;
        cell.status = CellStatus.correct;
      }
    });

    newRow.forEach((cell, index) => {
      if (cell.status !== undefined) {
        return;
      }

      const charIndex = remainingChars.indexOf(row[index].char);

      if (charIndex >= 0) {
        remainingChars[charIndex] = undefined;
      }

      cell.status = charIndex === -1 ? CellStatus.notPresent : CellStatus.wrongPlace;
    });

    const newCharsStatus = { ...charsStatus };
    newRow.forEach(({ status }, index) => {
      newCharsStatus[row[index].char] = Math.max(
        newCharsStatus[row[index].char] ?? CellStatus.notPresent,
        status ?? CellStatus.notPresent,
      );
    });

    const complete = newRow.every(cell => cell?.status === CellStatus.correct);

    setGameState(
      update(gameState, {
        status: {
          $set: complete
            ? GameStatus.completed
            : activeRow === numRows - 1
            ? GameStatus.failed
            : GameStatus.playing,
        },
        charsStatus: { $set: newCharsStatus },
        table: {
          rows: { [activeRow]: { $set: newRow } },
          activeRow: { $set: complete ? numRows : activeRow + 1 },
          activeCell: { $set: 0 },
        },
      }),
    );
  }, [gameState]);

  const setActiveCell = useCallback((activeCell: number) => {
    setGameState(gameState => update(gameState, { table: { activeCell: { $set: activeCell } } }));
  }, []);

  const onKeyPress = useCallback(
    (key: string) => {
      const {
        table: { rows, activeRow, activeCell },
      } = gameState;

      if (activeCell < numCells && /^[a-z]$/.test(key)) {
        setCharAtCell(activeCell, key);
      } else if (activeCell > 0 && key === 'Backspace') {
        setCharAtCell(activeCell - 1, undefined);
      } else if (
        activeRow < numRows &&
        rows[activeRow].filter(Boolean).length === numCells &&
        key === 'Enter'
      ) {
        verifyActiveRow();
      }
    },
    [gameState, setCharAtCell, verifyActiveRow],
  );

  const restart = useCallback(() => {
    setGameState(getInitialState());
  }, []);

  return { ...gameState, setActiveCell, onKeyPress, restart };
}

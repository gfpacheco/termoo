import update from 'immutability-helper';
import { useCallback } from 'react';
import getRandomElement from '../lib/getRandomElement';
import getValidWord from '../lib/getValidWord';
import removeDiacritics from '../lib/removeDiacritics';
import words from '../lib/words';
import usePersistentState from './usePersistentState';

export interface GameState extends PersistedState {
  done: boolean;
  succeeded: boolean;
  onCellClick(activeCellIndex: number): void;
  onKeyPress(key: string): void;
  restart(): void;
}

export interface PersistedState {
  word: string;
  charsStatus: Record<string, CellStatus>;
  table: TableState;
  error?: string;
}

export interface TableState {
  rows: (CellState | undefined)[][];
  activeRowIndex: number;
  activeCellIndex: number;
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

export const numRows = 6;
export const numCells = 5;
export const persistenceKey = 'gameState';

function getInitialState(): PersistedState {
  return {
    word: getRandomElement(words),
    charsStatus: {},
    table: {
      rows: [...Array(numRows)].map(() => [...Array(numCells)]),
      activeRowIndex: 0,
      activeCellIndex: 0,
    },
  };
}

export default function useGameState(): GameState {
  const [gameState, setGameState] = usePersistentState(getInitialState(), persistenceKey);

  const setCharAtCell = useCallback(
    (cell: number, char: string | undefined) => {
      setGameState(gameState => {
        const {
          table: { activeRowIndex },
        } = gameState;

        return update(gameState, {
          table: {
            rows: {
              [activeRowIndex]: {
                [cell]: { $set: char ? { char } : undefined },
              },
            },
            activeCellIndex: { $set: char ? cell + 1 : cell },
          },
          error: { $set: undefined },
        });
      });
    },
    [setGameState],
  );

  const verifyActiveRowIndex = useCallback(() => {
    const {
      word,
      charsStatus,
      table: { rows, activeRowIndex },
    } = gameState;
    const row = rows[activeRowIndex] as CellState[];
    const entry = row.map(cell => cell?.char).join('');
    const validEntry = getValidWord(entry);

    if (!validEntry) {
      setGameState(
        update(gameState, {
          error: { $set: 'Palavra não encontrada na lista' },
        }),
      );
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
        charsStatus: { $set: newCharsStatus },
        table: {
          rows: { [activeRowIndex]: { $set: newRow } },
          activeRowIndex: { $set: complete ? numRows : activeRowIndex + 1 },
          activeCellIndex: { $set: 0 },
        },
      }),
    );
  }, [gameState, setGameState]);

  const onCellClick = useCallback(
    (activeCellIndex: number) => {
      setGameState(gameState =>
        update(gameState, {
          table: { activeCellIndex: { $set: activeCellIndex } },
        }),
      );
    },
    [setGameState],
  );

  const restart = useCallback(() => {
    setGameState(getInitialState());
  }, [setGameState]);

  const onKeyPress = useCallback(
    (key: string) => {
      const {
        table: { rows, activeRowIndex, activeCellIndex },
      } = gameState;

      if (activeCellIndex < numCells && /^[a-z]$/.test(key)) {
        setCharAtCell(activeCellIndex, key);
      } else if (key === 'Backspace' && activeCellIndex > 0) {
        setCharAtCell(activeCellIndex - 1, undefined);
      } else if (key === 'ArrowLeft' && activeCellIndex > 0) {
        onCellClick(activeCellIndex - 1);
      } else if (key === 'ArrowRight' && activeCellIndex < numCells - 1) {
        onCellClick(activeCellIndex + 1);
      } else if (key === 'Enter' && activeRowIndex === numRows) {
        restart();
      } else if (
        key === 'Enter' &&
        activeRowIndex < numRows &&
        rows[activeRowIndex].filter(Boolean).length === numCells
      ) {
        verifyActiveRowIndex();
      }
    },
    [gameState, onCellClick, restart, setCharAtCell, verifyActiveRowIndex],
  );

  const done = gameState.table.activeRowIndex === gameState.table.rows.length;
  const succeeded =
    done &&
    gameState.table.rows.some(row =>
      row.every(cellState => cellState?.status === CellStatus.correct),
    );

  return { ...gameState, done, succeeded, onCellClick, onKeyPress, restart };
}

import update from 'immutability-helper';
import { useCallback, useState } from 'react';
import getRandomElement from '../lib/getRandomElement';
import getValidWord from '../lib/getValidWord';
import removeDiacritics from '../lib/removeDiacritics';
import words from '../lib/words';

export interface GameState {
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

const numRows = 6;
const numCells = 5;

function getInitialState(): GameState {
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

export default function useGameState() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());

  const setCharAtCell = useCallback((cell: number, char: string | undefined) => {
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
  }, []);

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
        charsStatus: { $set: newCharsStatus },
        table: {
          rows: { [activeRowIndex]: { $set: newRow } },
          activeRowIndex: { $set: complete ? numRows : activeRowIndex + 1 },
          activeCellIndex: { $set: 0 },
        },
      }),
    );
  }, [gameState]);

  const onCellClick = useCallback((activeCellIndex: number) => {
    setGameState(gameState =>
      update(gameState, { table: { activeCellIndex: { $set: activeCellIndex } } }),
    );
  }, []);

  const onKeyPress = useCallback(
    (key: string) => {
      const {
        table: { rows, activeRowIndex, activeCellIndex },
      } = gameState;

      if (activeCellIndex < numCells && /^[a-z]$/.test(key)) {
        setCharAtCell(activeCellIndex, key);
      } else if (activeCellIndex > 0 && key === 'Backspace') {
        setCharAtCell(activeCellIndex - 1, undefined);
      } else if (
        activeRowIndex < numRows &&
        rows[activeRowIndex].filter(Boolean).length === numCells &&
        key === 'Enter'
      ) {
        verifyActiveRowIndex();
      }
    },
    [gameState, setCharAtCell, verifyActiveRowIndex],
  );

  const restart = useCallback(() => {
    setGameState(getInitialState());
  }, []);

  return { ...gameState, onCellClick, onKeyPress, restart };
}

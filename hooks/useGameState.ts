import { useCallback, useEffect, useState } from 'react';

const numRows = 6;
const numCells = 5;

export interface GameState {
  table: TableState;
}

export interface TableState {
  rows: (CellState | undefined)[][];
  activeRow: number;
  activeCell: number;
}

export interface CellState {
  char: string;
  status: CellStatus;
}

export enum CellStatus {
  unknown,
  wrongChar,
  wrongPlace,
  right,
}

export default function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    table: {
      rows: [...Array(numRows)].map(() => [...Array(numCells)]),
      activeRow: 0,
      activeCell: 0,
    },
  });

  const setCharAtCell = useCallback((cell: number, char: string | undefined) => {
    setGameState(gameState => {
      const {
        table: { rows, activeRow },
      } = gameState;
      const newRow = [...rows[activeRow]];
      newRow[cell] = char ? { char, status: CellStatus.unknown } : undefined;
      const newRows = [...rows];
      newRows[activeRow] = newRow;
      return {
        ...gameState,
        table: {
          ...gameState.table,
          rows: newRows,
          activeCell: char ? cell + 1 : cell,
        },
      };
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const {
        table: { activeCell },
      } = gameState;

      if (activeCell < numCells && /^[a-z]$/.test(event.key)) {
        setCharAtCell(activeCell, event.key);
      } else if (activeCell > 0 && event.key === 'Backspace') {
        setCharAtCell(activeCell - 1, undefined);
      } else if (activeCell === numCells && event.key === 'Enter') {
        // TODO: implement
      }
    },
    [gameState, setCharAtCell],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return gameState;
}

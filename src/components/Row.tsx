import classNames from 'classnames';
import { CellState } from '../hooks/useGameState';
import Cell from './Cell';

export interface RowProps extends React.ComponentPropsWithoutRef<'div'> {
  row: (CellState | undefined)[];
  isActive: boolean;
  activeCell: number;
  setActiveCell?(activeCell: number): void;
}

export default function Row({
  className,
  row,
  isActive,
  activeCell,
  setActiveCell,
  ...rest
}: RowProps) {
  return (
    <div className={classNames(className, 'grid grid-cols-5 gap-1')} {...rest}>
      {row.map((state, index) => (
        <Cell
          key={index}
          state={state}
          isRowActive={isActive}
          isActive={isActive && activeCell === index}
          onClick={() => setActiveCell?.(index)}
        />
      ))}
    </div>
  );
}

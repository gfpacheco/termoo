import classNames from 'classnames';
import { CellState } from '../hooks/useGameState';
import Row from './Row';

export interface TableProps extends React.ComponentPropsWithoutRef<'div'> {
  rows: (CellState | undefined)[][];
  activeRowIndex: number;
  activeCellIndex: number;
  setActiveCellIndex(activeCellIndex: number): void;
}

export default function Table({
  className,
  rows,
  activeRowIndex,
  activeCellIndex,
  setActiveCellIndex,
  ...rest
}: TableProps) {
  return (
    <div className={classNames(className, 'grid grid-cols-1 gap-1')} {...rest}>
      {rows.map((row, index) => (
        <Row
          key={index}
          row={row}
          isActive={activeRowIndex === index}
          activeCellIndex={activeCellIndex}
          setActiveCellIndex={activeRowIndex === index ? setActiveCellIndex : undefined}
        />
      ))}
    </div>
  );
}

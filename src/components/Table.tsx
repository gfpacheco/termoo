import classNames from 'classnames';
import { CellState } from '../hooks/useGameState';
import Row from './Row';

export interface TableProps extends React.ComponentPropsWithoutRef<'div'> {
  rows: (CellState | undefined)[][];
  activeRow: number;
  activeCell: number;
}

export default function Table({ className, rows, activeRow, activeCell, ...rest }: TableProps) {
  return (
    <div className={classNames(className, 'grid grid-cols-1 gap-1')} {...rest}>
      {rows.map((row, index) => (
        <Row key={index} row={row} isActive={activeRow === index} activeCell={activeCell} />
      ))}
    </div>
  );
}

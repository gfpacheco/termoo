import classNames from 'classnames';
import { CellState } from '../hooks/useGameState';

export interface CellProps extends React.ComponentPropsWithoutRef<'div'> {
  state?: CellState;
  isRowActive: boolean;
  isActive: boolean;
}

export default function Cell({ className, state, isRowActive, isActive, ...rest }: CellProps) {
  return (
    <div
      className={classNames(
        className,
        'w-16 h-16 flex items-center justify-center border-2 rounded text-2xl font-bold uppercase transition-all',
        isRowActive && 'border-gray-400',
        isActive && 'border-b-8',
      )}
      {...rest}
    >
      {state?.char}
    </div>
  );
}

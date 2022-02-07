import classNames from 'classnames';
import { CellState, CellStatus } from '../hooks/useGameState';

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
        {
          'bg-green-200 border-green-200': state?.status === CellStatus.correct,
          'bg-yellow-200 border-yellow-200': state?.status === CellStatus.wrongPlace,
          'bg-gray-200 border-gray-200': state?.status === CellStatus.notPresent,
        },
      )}
      {...rest}
    >
      {state?.char}
    </div>
  );
}

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
        'w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center border-2 rounded text-4xl font-bold uppercase transition-all',
        isActive && 'border-b-8',
        {
          'border-gray-400 dark:border-gray-500': isRowActive,
          'border-gray-200 dark:border-gray-700': !isRowActive && !state,
          'bg-green-200 border-green-200 dark:bg-green-700 dark:border-green-700':
            state?.status === CellStatus.correct,
          'bg-yellow-200 border-yellow-200 dark:bg-yellow-600 dark:border-yellow-600':
            state?.status === CellStatus.wrongPlace,
          'bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-700':
            state?.status === CellStatus.notPresent,
        },
      )}
      {...rest}
    >
      {state?.char}
    </div>
  );
}

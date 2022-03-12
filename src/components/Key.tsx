import classNames from 'classnames';
import { CellStatus } from '../hooks/useGameState';

export interface KeyProps extends React.ComponentPropsWithoutRef<'button'> {
  status?: CellStatus;
}

export default function Key({ className, status, ...rest }: KeyProps) {
  return (
    <button
      className={classNames(
        className,
        'flex-1 h-12 sm:h-14 flex items-center justify-center border rounded-lg font-semibold uppercase',
        {
          'border-gray-200 dark:border-gray-500': status === undefined,
          'bg-green-200 border-green-200 dark:bg-green-700 dark:border-green-700':
            status === CellStatus.correct,
          'bg-yellow-200 border-yellow-200 dark:bg-yellow-600 dark:border-yellow-600':
            status === CellStatus.wrongPlace,
          'bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-700':
            status === CellStatus.notPresent,
        },
      )}
      {...rest}
    />
  );
}

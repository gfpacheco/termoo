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
        'h-16 flex items-center justify-center border rounded-lg uppercase',
        {
          'bg-green-200 border-green-200': status === CellStatus.correct,
          'bg-yellow-200 border-yellow-200': status === CellStatus.wrongPlace,
          'bg-gray-200 border-gray-200': status === CellStatus.notPresent,
        },
      )}
      {...rest}
    />
  );
}

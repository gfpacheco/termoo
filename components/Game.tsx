import classNames from 'classnames';
import useGameState from '../hooks/useGameState';
import Table from './Table';

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const { table } = useGameState();

  return (
    <div className={classNames(className, '')} {...rest}>
      <Table {...table} />
    </div>
  );
}

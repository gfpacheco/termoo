import classNames from 'classnames';
import useGameState, { GameStatus } from '../hooks/useGameState';
import ResetButton from './ResetButton';
import Table from './Table';
import Toast from './Toast';

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const { status, word, table, restart } = useGameState();

  return (
    <div className={classNames(className, 'flex flex-col items-center')} {...rest}>
      {status === GameStatus.failed && <Toast>Palavra certa: {word}</Toast>}
      <Table {...table} />
      <ResetButton className="mt-8" onClick={restart} />
    </div>
  );
}

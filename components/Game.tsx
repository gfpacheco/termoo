import classNames from 'classnames';
import { useEffect } from 'react';
import useGameState, { GameStatus } from '../hooks/useGameState';
import Keyboard from './Keyboard';
import ResetButton from './ResetButton';
import Table from './Table';
import Toast from './Toast';

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const { status, word, charsState, table, error, onKeyPress, restart } = useGameState();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      onKeyPress(event.key);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);

  return (
    <div
      className={classNames(className, 'h-full p-2 flex flex-col items-center justify-center')}
      {...rest}
    >
      {status === GameStatus.failed && <Toast>Palavra certa: {word}</Toast>}
      {error && <Toast>{error}</Toast>}
      <Table {...table} />
      <ResetButton className="my-2" onClick={restart} />
      <Keyboard charsState={charsState} onKeyPress={onKeyPress} />
    </div>
  );
}

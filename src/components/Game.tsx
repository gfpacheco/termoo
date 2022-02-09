import classNames from 'classnames';
import { useEffect } from 'react';
import useGameState, { CellStatus } from '../hooks/useGameState';
import Keyboard from './Keyboard';
import ResetButton from './ResetButton';
import Table from './Table';
import Toast from './Toast';

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const { word, charsStatus, table, error, onCellClick, onKeyPress, restart } = useGameState();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      onKeyPress(event.key);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);

  const done = table.activeRowIndex === table.rows.length;
  const succeeded =
    done &&
    table.rows.some(row => row.every(cellState => cellState?.status === CellStatus.correct));

  return (
    <div
      className={classNames(className, 'h-full p-2 flex flex-col items-center justify-center')}
      {...rest}
    >
      {done && <Toast>{succeeded ? 'Parabéns!' : <>Palavra certa: {word}</>}</Toast>}
      {error && <Toast>{error}</Toast>}
      <Table {...table} onCellClick={onCellClick} />
      <ResetButton className="my-2" onClick={restart} />
      <Keyboard charsStatus={charsStatus} onKeyPress={onKeyPress} />
    </div>
  );
}

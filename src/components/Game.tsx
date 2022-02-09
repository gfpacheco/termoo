import classNames from 'classnames';
import { useEffect } from 'react';
import useGameState, { CellStatus } from '../hooks/useGameState';
import Keyboard from './Keyboard';
import ResetButton from './ResetButton';
import Table from './Table';
import Toast from './Toast';

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const { word, charsStatus, table, error, setActiveCellIndex, onKeyPress, restart } =
    useGameState();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      onKeyPress(event.key);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);

  const failed =
    table.activeRowIndex === table.rows.length &&
    table.rows[table.activeRowIndex - 1].some(
      cellState => cellState?.status !== CellStatus.correct,
    );

  return (
    <div
      className={classNames(className, 'h-full p-2 flex flex-col items-center justify-center')}
      {...rest}
    >
      {failed && <Toast>Palavra certa: {word}</Toast>}
      {error && <Toast>{error}</Toast>}
      <Table {...table} setActiveCellIndex={setActiveCellIndex} />
      <ResetButton className="my-2" onClick={restart} />
      <Keyboard charsStatus={charsStatus} onKeyPress={onKeyPress} />
    </div>
  );
}

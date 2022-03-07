import classNames from 'classnames';
import { useCallback, useLayoutEffect, useState } from 'react';
import useGameState from '../hooks/useGameState';
import useHistory from '../hooks/useHistory';
import useKeyDownHandler from '../hooks/useKeyDownHandler';
import GameEnd from './GameEnd';
import Keyboard from './Keyboard';
import Logo from './Logo';
import RestartButton from './RestartButton';
import Table from './Table';
import Toast from './Toast';

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const gameState = useGameState();
  const [gameEndOpen, setGameEndOpen] = useState(false);
  const history = useHistory(gameState);
  const { charsStatus, table, error, done, onCellClick, onKeyPress, restart } = gameState;
  const { onGiveUp } = history;

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState.done) {
        setGameEndOpen(true);
      } else {
        onKeyPress(key);
      }
    },
    [gameState.done, onKeyPress],
  );

  const handleRestartClick = useCallback(() => {
    if (!gameState.done) {
      onGiveUp();
    }
    restart();
  }, [gameState.done, onGiveUp, restart]);

  useKeyDownHandler(handleKeyPress);

  useLayoutEffect(() => {
    setGameEndOpen(done);
  }, [done]);

  return (
    <div
      className={classNames(className, 'h-full p-2 flex flex-col items-center justify-center')}
      {...rest}
    >
      <GameEnd
        open={done && gameEndOpen}
        onRequestClose={() => setGameEndOpen(false)}
        gameState={gameState}
        history={history}
      />
      {error && <Toast>{error}</Toast>}
      <Logo className="mt-2 mb-4 sm:mb-8 h-6 sm:h-10" />
      <Table {...table} onCellClick={onCellClick} />
      <RestartButton className="my-2" onClick={handleRestartClick} />
      <Keyboard charsStatus={charsStatus} onKeyPress={handleKeyPress} />
    </div>
  );
}

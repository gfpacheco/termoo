import classNames from 'classnames';
import range from 'lodash.range';
import { GameState, numRows } from '../hooks/useGameState';
import { HistoryState } from '../hooks/useHistory';
import Modal, { ModalProps } from './Modal';
import ProgressBar from './ProgressBar';
import RestartButton from './RestartButton';
import Stat from './Stat';

export interface GameEndProps extends ModalProps {
  gameState: GameState;
  history: HistoryState;
}

export default function GameEnd({ className, gameState, history, ...rest }: GameEndProps) {
  const { succeeded, word, restart } = gameState;
  const winPercentage = Math.round(
    (100 * (history.totalRounds - history.failures - history.abandonments)) / history.totalRounds,
  );
  const maxProgress = Math.max(
    history.failures + history.abandonments,
    ...Object.values(history.successByAttempts),
  );

  return (
    <Modal className={classNames(className, 'text-center')} {...rest}>
      <p className="mb-4 text-2xl">
        {succeeded ? (
          'Parabéns!'
        ) : (
          <>
            Palavra certa: <span className="font-bold uppercase">{word}</span>
          </>
        )}
      </p>
      <div className="mb-4 flex">
        <Stat value={history.totalRounds} label="jogos" />
        <Stat value={`${winPercentage}%`} label="de vitórias" />
        <Stat value={history.streak} label="sequência de vitórias" />
        <Stat value={history.bestStreak} label="melhor sequência" />
      </div>
      <p className="mb-2 text-lg text-center">Resultados anteriores</p>
      {range(1, numRows + 1).map(attempts => (
        <ProgressBar
          key={attempts}
          label={attempts}
          value={history.successByAttempts[attempts] ?? 0}
          total={maxProgress}
        />
      ))}
      <ProgressBar
        label="☠️"
        value={history.failures + history.abandonments}
        total={maxProgress}
        bad
      />
      <RestartButton onClick={restart} />
    </Modal>
  );
}

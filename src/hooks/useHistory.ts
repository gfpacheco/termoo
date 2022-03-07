import update from 'immutability-helper';
import { useCallback, useEffect } from 'react';
import { GameState } from './useGameState';
import usePersistentState from './usePersistentState';
import usePrevious from './usePrevious';

export interface HistoryState extends PersistedState {
  totalRounds: number;
}

interface PersistedState {
  successByAttempts: Record<number, number>;
  failures: number;
  abandonments: number;
  streak: number;
  bestStreak: number;
}

const persistenceKey = 'historyState';

function getInitialState(): PersistedState {
  return {
    successByAttempts: {},
    failures: 0,
    abandonments: 0,
    streak: 0,
    bestStreak: 0,
  };
}

export default function useHistory(gameState: GameState) {
  const [historyState, setHistoryState] = usePersistentState(getInitialState(), persistenceKey);
  const previousDone = usePrevious(gameState.done);

  useEffect(() => {
    if (previousDone === false && gameState.done) {
      setHistoryState(historyState => {
        if (gameState.succeeded) {
          const attempts = gameState.table.rows.filter(row => row[0]).length;
          const streak = historyState.streak + 1;
          return update(historyState, {
            successByAttempts: {
              [attempts]: value => (value ?? 0) + 1,
            },
            streak: { $set: streak },
            bestStreak: { $set: Math.max(streak, historyState.bestStreak) },
          });
        }

        return update(historyState, {
          failures: value => value + 1,
          streak: { $set: 0 },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.done]);

  const onGiveUp = useCallback(() => {
    setHistoryState(historyState =>
      update(historyState, {
        abandonments: value => value + 1,
        streak: { $set: 0 },
      }),
    );
  }, [setHistoryState]);

  const totalRounds =
    historyState.failures +
    historyState.abandonments +
    Object.values(historyState.successByAttempts).reduce((sum, current) => current ?? 0 + sum, 0);

  return { ...historyState, totalRounds, onGiveUp };
}

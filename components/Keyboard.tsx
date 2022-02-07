import classNames from 'classnames';
import { useMemo } from 'react';
import { CellState, CellStatus } from '../hooks/useGameState';
import Key from './Key';

export interface KeyboardProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onKeyPress'> {
  charsState: CellState[];
  onKeyPress(key: string): void;
}

export default function Keyboard({ className, charsState, onKeyPress, ...rest }: KeyboardProps) {
  const statusByChar = useMemo(() => {
    const statusByChar: Record<string, CellStatus | undefined> = {};
    charsState.forEach(state => {
      statusByChar[state.char] = state.status;
    });
    return statusByChar;
  }, [charsState]);

  return (
    <div className={classNames(className, 'w-full max-w-md')} {...rest}>
      <div className="flex">
        {['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(char => (
          <Key
            key={char}
            className="mr-1"
            status={statusByChar[char]}
            onClick={() => onKeyPress(char)}
          >
            {char}
          </Key>
        ))}
        <div className="w-8" />
      </div>
      <div className="mt-1 flex justify-end">
        <div className="w-4" />
        {['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(char => (
          <Key
            key={char}
            className="ml-1"
            status={statusByChar[char]}
            onClick={() => onKeyPress(char)}
          >
            {char}
          </Key>
        ))}
        <Key className="ml-4" onClick={() => onKeyPress('Backspace')}>
          ⌫
        </Key>
      </div>
      <div className="mt-1 flex justify-end">
        <div className="w-8" />
        {['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(char => (
          <Key
            key={char}
            className="ml-1"
            status={statusByChar[char]}
            onClick={() => onKeyPress(char)}
          >
            {char}
          </Key>
        ))}
        <Key className="ml-4 flex-[2]" onClick={() => onKeyPress('Enter')}>
          enter
        </Key>
      </div>
    </div>
  );
}

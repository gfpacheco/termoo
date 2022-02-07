import classNames from 'classnames';
import { useState } from 'react';
import Table from './Table';

const numEntries = 6;
const numLetters = 5;

export interface GameProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Game({ className, ...rest }: GameProps) {
  const [entries, setEntries] = useState<(string | undefined)[][]>(
    [...Array(numEntries)].map(() => [...Array(numLetters)]),
  );

  return (
    <div className={classNames(className, '')} {...rest}>
      <Table entries={entries} />
    </div>
  );
}

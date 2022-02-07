import classNames from 'classnames';
import Cell from './Cell';

export interface RowProps extends React.ComponentPropsWithoutRef<'div'> {
  entry: (string | undefined)[];
}

export default function Row({ className, entry, ...rest }: RowProps) {
  return (
    <div className={classNames(className, 'grid grid-cols-5 gap-1')} {...rest}>
      {entry.map((letter, index) => (
        <Cell key={index} letter={letter} />
      ))}
    </div>
  );
}

import classNames from 'classnames';
import Row from './Row';

export interface TableProps extends React.ComponentPropsWithoutRef<'div'> {
  entries: (string | undefined)[][];
}

export default function Table({ className, entries, ...rest }: TableProps) {
  return (
    <div className={classNames(className, 'grid grid-cols-1 gap-1')} {...rest}>
      {entries.map((entry, index) => (
        <Row key={index} entry={entry} />
      ))}
    </div>
  );
}

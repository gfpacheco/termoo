import classNames from 'classnames';

export interface CellProps extends React.ComponentPropsWithoutRef<'div'> {
  letter?: string;
}

export default function Cell({ className, letter, ...rest }: CellProps) {
  return (
    <div
      className={classNames(
        className,
        'w-16 h-16 flex items-center justify-center border-2 rounded',
      )}
      {...rest}
    >
      {letter}
    </div>
  );
}

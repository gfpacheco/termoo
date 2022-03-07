import classNames from 'classnames';
import { ReactNode } from 'react';

export interface StatProps extends React.ComponentPropsWithoutRef<'div'> {
  value: ReactNode;
  label: ReactNode;
}

export default function Stat({ className, value, label, ...rest }: StatProps) {
  return (
    <div
      className={classNames(className, 'flex-1 flex flex-col items-center p-2 sm:p-4')}
      {...rest}
    >
      <p className="text-xl sm:text-3xl font-bold mb-2">{value}</p>
      <p className="flex-1 flex items-center text-xs sm:text-base">{label}</p>
    </div>
  );
}

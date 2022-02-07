import classNames from 'classnames';

export interface ToastProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Toast({ className, children, ...rest }: ToastProps) {
  return (
    <div
      className={classNames(className, 'absolute left-0 right-0 top-16 flex justify-center')}
      {...rest}
    >
      <div className="bg-blue-100 px-8 py-4 text-lg rounded-lg">{children}</div>
    </div>
  );
}

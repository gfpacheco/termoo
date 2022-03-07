import classNames from 'classnames';

export interface ModalProps extends React.ComponentPropsWithoutRef<'div'> {
  open: boolean;
  onRequestClose(): void;
}

export default function Modal({ className, open, onRequestClose, children, ...rest }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className={classNames(className, 'absolute inset-0 flex items-center justify-center')}
      onClick={onRequestClose}
      {...rest}
    >
      <div className="absolute inset-0 bg-black opacity-30" />
      <div className="relative w-11/12 max-w-lg rounded-lg bg-white p-4 sm:p-8 shadow">
        {children}
      </div>
    </div>
  );
}

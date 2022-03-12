import classNames from 'classnames';
import { useState } from 'react';

export interface DarkModeToggleProps extends React.ComponentPropsWithoutRef<'button'> {}

function DarkModeToggle({ className, ...rest }: DarkModeToggleProps) {
  const [on, setOn] = useState(document.documentElement.classList.contains('dark'));

  function toggleDarkMode() {
    if (on) {
      setOn(false);
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    } else {
      setOn(true);
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    }
  }

  return (
    <button
      type="button"
      className={classNames(
        className,
        'absolute top-4 right-4 w-16 h-8 rounded-full border-2 border-yellow-300 dark:border-gray-500 focus:outline-none transition duration-300',
      )}
      onClick={toggleDarkMode}
      {...rest}
    >
      <span className={classNames('absolute top-0 right-2 leading-7', !on && 'hidden')}>🌙</span>
      <span className={classNames('absolute top-0 left-2 leading-7', on && 'hidden')}>☀️</span>
      <span
        className={classNames(
          'absolute top-1 left-1 h-5 w-5 rounded-full border-2 border-yellow-300 bg-yellow-100 dark:border-gray-500 dark:bg-gray-400 transform duration-300 transition',
          !on && 'translate-x-8',
        )}
      />
    </button>
  );
}

export default DarkModeToggle;

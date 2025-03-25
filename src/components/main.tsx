import { forwardRef, HTMLAttributes } from 'react';

interface MainProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Main = forwardRef<HTMLElement, MainProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <main
        ref={ref}
        className={`h-full w-full overflow-x-hidden overflow-y-scroll px-2 ${className}`}
        {...rest}
      >
        {children}
      </main>
    );
  },
);
Main.displayName = 'Main';

export { Main };

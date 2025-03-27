import { forwardRef, HTMLAttributes } from 'react';

interface MainProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Main = forwardRef<HTMLElement, MainProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <main
        ref={ref}
        className={`h-[655px] w-full overflow-y-scroll px-2 pb-4 ${className}`}
        {...rest}
      >
        {children}
      </main>
    );
  },
);
Main.displayName = 'Main';

export { Main };

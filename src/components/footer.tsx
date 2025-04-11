import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';

const footerVariants = cva(
  'fixed bottom-0 left-0 w-full p-2  z-10 flex items-center  justify-center border-t bg-white dark:bg-gray-800  ',
  {
    variants: {
      variant: {
        default: 'bg-amber-500 text-white ',
        destructive: 'bg-red-600 text-white border-red-700 shadow-sm',
        outline: [
          'border-gray-200 bg-white shadow-sm',
          'dark:border-gray-700 dark:bg-gray-800',
          'hover:bg-gray-50 dark:hover:bg-gray-750',
        ],
        secondary: [
          'bg-gray-100 text-gray-900 border-gray-200',
          'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600',
          'hover:bg-gray-200 dark:hover:bg-gray-600',
        ],
        ghost: [
          'bg-transparent border-transparent',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
        ],
        link: [
          'bg-transparent border-transparent',
          'text-blue-600 dark:text-blue-400',
          'hover:underline underline-offset-4',
        ],
      },
      size: {},
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  children: ReactNode;
  sticky?: boolean;
  withContainer?: boolean;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      className,
      variant,
      size,
      children,
      sticky = false,
      withContainer = false,
      ...props
    },
    ref,
  ) => {
    const footerClasses = cn(
      footerVariants({ variant, size, className }),
      sticky && 'sticky',
    );

    return (
      <footer ref={ref} className={footerClasses} {...props}>
        {withContainer ? (
          <div className='container mx-auto px-4'>{children}</div>
        ) : (
          children
        )}
      </footer>
    );
  },
);

Footer.displayName = 'Footer';

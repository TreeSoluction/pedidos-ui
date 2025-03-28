import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, MouseEvent, ReactNode } from 'react';
import { Button } from './ui/button';

const drawerVariants = cva(
  'fixed min-h-[40px] w-full p-4 shadow-lg z-20 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-amber-500 text-white border-amber-600',
        destructive:
          'bg-red-600 text-white border-red-700 shadow-md hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500/50 transition-colors',
        outline:
          'border border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750',
        secondary:
          'bg-gray-100 text-gray-900 border-gray-200 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        ghost:
          'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent',
        link: 'bg-transparent text-blue-600 hover:underline underline-offset-4 dark:text-blue-400 border-transparent',
      },
      size: {
        default: 'h-fit',
        sm: 'h-12',
        lg: 'h-16',
        compact: 'h-10 p-2',
      },
      width: {
        default: 'max-w-2xl',
        full: 'max-w-full',
        narrow: 'max-w-md',
        wide: 'max-w-4xl',
      },
      position: {
        bottom:
          'bottom-0 left-0 right-0 rounded-tl-lg rounded-tr-lg border-t-2',
        top: 'top-0 left-0 right-0 rounded-bl-lg rounded-br-lg border-b-2',
        left: 'left-0 top-0 bottom-0 w-auto h-full rounded-tr-lg rounded-br-lg border-r-2',
        right:
          'right-0 top-0 bottom-0 w-auto h-full rounded-tl-lg rounded-bl-lg border-l-2',
      },
      open: {
        true: 'translate-x-0 translate-y-0 opacity-100',
        false: '',
      },
    },
    compoundVariants: [
      {
        position: 'bottom',
        open: false,
        class: 'translate-y-full opacity-0',
      },
      {
        position: 'top',
        open: false,
        class: '-translate-y-full opacity-0',
      },
      {
        position: 'left',
        open: false,
        class: '-translate-x-full opacity-0',
      },
      {
        position: 'right',
        open: false,
        class: 'translate-x-full opacity-0',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      width: 'default',
      position: 'bottom',
      open: true,
    },
  },
);

const backdropVariants = cva(
  'fixed inset-0 bg-black z-10 transition-opacity duration-300 ease-in-out',
  {
    variants: {
      open: {
        true: 'opacity-75',
        false: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      open: true,
    },
  },
);

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  children: ReactNode;
  open?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
  title?: string;
  closeButton?: boolean;
}

const DrawerComponent = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      variant,
      size,
      width,
      position,
      open = false,
      children,
      onClose,
      title,
      closeButton = true,
      ...props
    },
    ref,
  ) => {
    const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && onClose) {
        onClose();
      }
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(backdropVariants({ open }))}
          onClick={handleBackdropClick}
        />

        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            drawerVariants({ variant, size, width, position, open, className }),
            position === 'top' || position === 'bottom' ? 'mx-auto' : 'my-auto',
          )}
          {...props}
        >
          {title && <h1 className='font-bold'>{title}</h1>}

          {children}

          {closeButton && (
            <Button type='button' onClick={onClose} className='mt-4 mb-2'>
              Fechar
            </Button>
          )}
        </div>
      </>
    );
  },
);

DrawerComponent.displayName = 'Drawer';

export const Drawer = DrawerComponent;

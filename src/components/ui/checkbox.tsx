import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';
import { ComponentProps, ElementRef, forwardRef } from 'react';

const checkboxVariants = cva(
  'peer border-input dark:bg-input/30 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        destructive:
          'data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground dark:data-[state=checked]:bg-destructive data-[state=checked]:border-destructive border-destructive/50',
        outline:
          'bg-transparent border border-input hover:bg-muted/50 data-[state=checked]:bg-transparent data-[state=checked]:border-primary',
        subtle:
          'bg-muted/20 dark:bg-muted/10 data-[state=checked]:bg-muted data-[state=checked]:text-muted-foreground dark:data-[state=checked]:bg-muted',
        ghost:
          'border-transparent bg-transparent data-[state=checked]:bg-transparent data-[state=checked]:text-primary',
      },
      size: {
        default: 'size-4',
        sm: 'size-3.5',
        lg: 'size-5',
        xl: 'size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface CheckboxProps
  extends ComponentProps<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot='checkbox'
      className={cn(checkboxVariants({ variant, size, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='flex items-center justify-center text-current transition-none'
      >
        <CheckIcon
          className={cn(
            'transition-none',
            size === 'sm' && 'size-3',
            size === 'default' && 'size-3.5',
            size === 'lg' && 'size-4',
            size === 'xl' && 'size-5',
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };

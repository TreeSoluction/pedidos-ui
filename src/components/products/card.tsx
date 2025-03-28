import { EPageType } from '@/enums/EPageType';
import { IProduct, IProductSelected } from '@/interfaces/IProducts';
import { Trash2 } from 'lucide-react';
import { forwardRef, HTMLProps, memo } from 'react';
import { useNavigate } from 'react-router';

interface ICardProductsProps extends HTMLProps<HTMLDivElement> {
  productData: IProduct;
  navigable: boolean;
}

export const CardProducts = memo(
  forwardRef<HTMLDivElement, ICardProductsProps>(
    ({ productData, navigable, ...props }, ref) => {
      const navigate = useNavigate();

      const productClicked = () => {
        navigate(`/product/${EPageType.edit}/${productData.id}`);
      };

      const handleClick = navigable ? productClicked : undefined;

      return (
        <div
          ref={ref}
          {...props}
          className={`rounded-md border p-2 shadow-md ${
            navigable ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'
          }`}
          role={navigable ? 'button' : undefined}
          tabIndex={navigable ? 0 : undefined}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (navigable && (e.key === 'Enter' || e.key === ' ')) {
              productClicked();
            }
          }}
        >
          <div className='flex flex-col'>
            <h2 className='font-semibold'>{productData.name}</h2>
            <p className='text-muted-foreground text-sm'>
              {productData.category.name}
            </p>
          </div>
        </div>
      );
    },
  ),
);

interface ICardProductsWithDetailsProps extends HTMLProps<HTMLDivElement> {
  productData: IProductSelected;
  onRemove?: () => void;
}

export const CardProductsWithDetails = memo(
  forwardRef<HTMLDivElement, ICardProductsWithDetailsProps>(
    ({ productData, onRemove, ...props }, ref) => {
      const formattedPrice = productData.buy_price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const quantity = productData.quantity ?? 1;
      const totalPrice = (productData.buy_price * quantity).toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL',
        },
      );

      return (
        <div ref={ref} {...props} className={`rounded-md border p-2 shadow-md`}>
          <div className='flex flex-col'>
            <h2 className='font-semibold'>{productData.name}</h2>
            <p className='text-muted-foreground text-sm'>
              {productData.category.name}
            </p>
            {productData.observation && (
              <p className='text-muted-foreground text-sm'>
                Obs: {productData.observation}
              </p>
            )}
            <div className='mt-2 flex items-center justify-between'>
              <span className='text-sm'>
                {quantity} x {formattedPrice}
              </span>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>{totalPrice}</span>
                {onRemove && (
                  <button
                    onClick={onRemove}
                    className='text-red-500 hover:text-red-700'
                    aria-label={`Remover ${productData.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
  ),
);

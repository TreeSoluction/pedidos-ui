import { EPageType } from '@/enums/EPageType';
import { IProduct } from '@/interfaces/IProducts';
import { forwardRef, HTMLProps } from 'react';
import { useNavigate } from 'react-router';

interface ICardProductsProps extends HTMLProps<HTMLDivElement> {
  productData: IProduct;
}

export const CardProducts = forwardRef<HTMLDivElement, ICardProductsProps>(
  ({ productData, ...props }, ref) => {
    const navigate = useNavigate();

    const productClicked = () => {
      navigate(`/product/${EPageType.edit}/${productData.id}`);
    };

    return (
      <div
        ref={ref}
        {...props}
        className='rounded-md border p-2 shadow-md'
        onClick={productClicked}
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
);

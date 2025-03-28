import { EPageType } from '@/enums/EPageType';
import { IOrder } from '@/interfaces/IOrders';
import { forwardRef, HTMLProps } from 'react';
import { useNavigate } from 'react-router';

interface ICardOrdersProps extends HTMLProps<HTMLDivElement> {
  orderData: IOrder;
}

export const CardOrders = forwardRef<HTMLDivElement, ICardOrdersProps>(
  ({ orderData, ...props }, ref) => {
    const navigate = useNavigate();

    const orderClicked = () => {
      navigate(`/order/${EPageType.edit}/${orderData.id}`);
    };

    return (
      <div
        ref={ref}
        {...props}
        className='rounded-md border p-2 shadow-md'
        onClick={orderClicked}
      >
        <div className='flex flex-col'>
          <h2 className='font-semibold'>{orderData.name}</h2>
          <h2 className='font-semibold'>{orderData.address}</h2>
        </div>
      </div>
    );
  },
);

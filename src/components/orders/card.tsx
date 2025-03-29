import { IOrder } from '@/interfaces/IOrders';
import { forwardRef, HTMLProps, memo } from 'react';

interface ICardOrdersProps extends HTMLProps<HTMLDivElement> {
  orderData: IOrder;
}

export const CardOrders = memo(
  forwardRef<HTMLDivElement, ICardOrdersProps>(
    ({ orderData, ...props }, ref) => {
      const totalValue = orderData.items
        .reduce((sum, item) => sum + (item.sold_price || 0), 0)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      return (
        <div
          ref={ref}
          {...props}
          className='rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='flex flex-col gap-2'>
            <h2 className='text-lg font-semibold text-gray-800'>
              {orderData.name || 'Sem nome'}
            </h2>
            <p className='text-muted-foreground text-sm'>
              Endereço: {orderData.address || 'Sem endereço'}
            </p>
            <p className='text-muted-foreground text-sm'>
              Criado em: {new Date(orderData.createdAt).toLocaleString('pt-BR')}
            </p>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm'>
                Itens: {orderData.items.length}
              </p>
              <p className='text-sm font-medium text-gray-800'>
                Total: {totalValue}
              </p>
            </div>
          </div>
        </div>
      );
    },
  ),
);

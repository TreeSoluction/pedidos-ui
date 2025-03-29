import { EPageType } from '@/enums/EPageType';
import { IOrder } from '@/interfaces/IOrders';
import { Trash2 } from 'lucide-react';
import { forwardRef, HTMLProps, memo, MouseEvent } from 'react';
import { useNavigate } from 'react-router';

interface ICardOrdersProps extends HTMLProps<HTMLDivElement> {
  orderData: IOrder;
  navigable?: boolean;
  onRemove?: () => void;
}

export const CardOrders = memo(
  forwardRef<HTMLDivElement, ICardOrdersProps>(
    ({ orderData, navigable, onRemove, ...props }, ref) => {
      const navigate = useNavigate();

      const totalValue = orderData.items
        .reduce((sum, item) => sum + (item.sold_price || 0), 0)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      const handleClick = () => {
        if (navigable) {
          navigate(`/order/${EPageType.edit}/${orderData.id}`);
        }
      };

      const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove?.();
      };

      return (
        <div
          ref={ref}
          {...props}
          className={`rounded-md border p-2 shadow-md transition-shadow hover:shadow-lg ${navigable ? 'cursor-pointer' : ''}`}
          onClick={navigable ? handleClick : undefined}
        >
          <div className='flex flex-col'>
            <h2 className='font-semibold'>{orderData.name || 'Sem nome'}</h2>
            <p className='text-muted-foreground text-sm'>
              Endereço: {orderData.address || 'Sem endereço'}
            </p>
            <p className='text-muted-foreground text-sm'>
              Criado em: {new Date(orderData.createdAt).toLocaleString('pt-BR')}
            </p>
            <div className='mt-2 flex items-center justify-between'>
              <span className='text-sm'>Itens: {orderData.items.length}</span>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>{totalValue}</span>
                {onRemove && (
                  <button
                    onClick={handleRemoveClick}
                    className='text-red-500 hover:text-red-700'
                    aria-label={`Remover pedido ${orderData.name}`}
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

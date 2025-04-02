import { EPageType } from '@/enums/EPageType';
import { IIngredient } from '@/interfaces/IIngredients';
import { Trash2 } from 'lucide-react';
import { forwardRef, HTMLProps, memo, MouseEvent } from 'react';
import { useNavigate } from 'react-router';

interface ICardIngredientsProps extends HTMLProps<HTMLDivElement> {
  ingredientData: IIngredient;
  navigable?: boolean;
  onRemove?: () => void;
}

export const CardIngredients = memo(
  forwardRef<HTMLDivElement, ICardIngredientsProps>(
    ({ ingredientData, navigable, onRemove, ...props }, ref) => {
      const navigate = useNavigate();

      const handleClick = () => {
        if (navigable) {
          navigate(`/ingredient/${EPageType.edit}/${ingredientData.id}`);
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
          className={`bingredient rounded-md p-2 shadow-md transition-shadow hover:shadow-lg ${navigable ? 'cursor-pointer' : ''}`}
          onClick={navigable ? handleClick : undefined}
        >
          <div className='flex flex-col'>
            <h2 className='font-semibold'>
              {ingredientData.name || 'Sem nome'}
            </h2>

            <div className='mt-2 flex items-center justify-between'>
              <p className='text-muted-foreground text-sm'>
                Preço por (kg):{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(ingredientData.sold_price ?? 0)}
              </p>

              <div className='flex items-center gap-2'>
                {onRemove && (
                  <>
                    <button
                      onClick={handleRemoveClick}
                      className='text-red-500 hover:text-red-700'
                      aria-label={`Remover pedido ${ingredientData.name}`}
                    >
                      <Trash2 size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
  ),
);

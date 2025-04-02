import { EPageType } from '@/enums/EPageType';
import { IIngredient, IIngredientInProduct } from '@/interfaces/IIngredients';
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

import { useState } from 'react';

interface QuantityInputProps {
  ingredient: IIngredientInProduct;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveIngredient: (id: string) => void;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  ingredient,
  onQuantityChange,
  onRemoveIngredient,
}) => {
  const [quantity, setQuantity] = useState<number | ''>(0);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.value === ''
        ? ''
        : Math.max(0, parseFloat(event.target.value));

    setQuantity(value);
    onQuantityChange(ingredient.id, value || 0);
  };

  const totalCost = ((quantity || 0) / 1000) * ingredient.sold_price;

  return (
    <div className='flex flex-col gap-2 rounded-lg border p-4 shadow'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{ingredient.name}</h3>

        <button
          onClick={() => onRemoveIngredient(ingredient.id)}
          className='text-red-500 hover:text-red-700'
        >
          <Trash2 />
        </button>
      </div>
      <label className='text-sm font-medium'>
        Quantidade por (g):
        <input
          type='number'
          min='0'
          value={quantity}
          onChange={handleQuantityChange}
          className='ml-2 w-24 rounded border p-1'
        />
      </label>
      <p className='text-sm text-gray-600'>
        Custo total:{' '}
        <strong>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalCost)}
        </strong>
      </p>
    </div>
  );
};

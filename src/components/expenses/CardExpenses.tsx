import { Button } from '@/components/ui/button';
import { EPageType } from '@/enums/EPageType';
import { IExpense } from '@/interfaces/IExpense';
import { Edit, Trash } from 'lucide-react';
import { Link } from 'react-router';

interface CardExpensesProps {
  expenseData: IExpense;
  navigable?: boolean;
  onRemove?: () => void;
}

export function CardExpenses({
  expenseData,
  navigable = false,
  onRemove,
}: CardExpensesProps) {
  const CardContent = () => (
    <div className='flex flex-col gap-2 rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col'>
          <span className='font-medium'>{expenseData.name}</span>
        </div>
        <div className='flex items-center gap-2'>
          {navigable && (
            <div className='flex items-center gap-2'>
              <Link to={`/expense/${EPageType.edit}/${expenseData.id}`}>
                <Button variant='outline' size='icon'>
                  <Edit size={18} />
                </Button>
              </Link>
              {onRemove && (
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                >
                  <Trash size={18} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='mt-2 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>
          Valor:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(expenseData.price ?? 0)}
        </p>
      </div>

      <div className='text-muted-foreground flex items-center justify-between text-sm'>
        <span>
          Criado em: {new Date(expenseData.createdAt).toLocaleDateString()}
        </span>
        <span>
          Atualizado em: {new Date(expenseData.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  if (navigable) {
    return <CardContent />;
  }

  return (
    <Link to={`/expense/${EPageType.edit}/${expenseData.id}`}>
      <CardContent />
    </Link>
  );
}

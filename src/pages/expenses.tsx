import { BackButton } from '@/components/back';
import { CardExpenses } from '@/components/expenses/CardExpenses';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EPageType } from '@/enums/EPageType';
import { IExpense } from '@/interfaces/IExpense';
import { DeleteExpense, GetAllExpenses } from '@/services/expense.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getAllExpenses();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!expenses) return;

    let result = [...expenses];

    if (searchName) {
      result = result.filter((expense) =>
        (expense.name || 'Sem nome')
          .toLowerCase()
          .includes(searchName.toLowerCase()),
      );
    }

    setFilteredExpenses(result);
  }, [expenses, searchName]);

  const getAllExpenses = async () => {
    const request = await GetAllExpenses();
    setExpenses(request);
    setFilteredExpenses(request);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await DeleteExpense(id);

      toast.success('Despesa excluída com sucesso!');

      await getAllExpenses();
    } catch (error) {
      console.log(error);

      toast.error('Não foi possível excluir a despesa. Tente novamente.');
    }
  };

  return (
    <>
      <BackButton to='/' />

      <Main className='flex flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:gap-6'>
          <div className='flex-1'>
            <Input
              placeholder='Pesquisar por nome...'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        {isLoading ? (
          <div className='text-muted-foreground text-center'>
            Carregando Despesas...
          </div>
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <CardExpenses
              expenseData={expense}
              key={expense.id}
              navigable={true}
              onRemove={() => handleDeleteClick(expense.id)}
            />
          ))
        ) : (
          <div className='text-muted-foreground text-center'>
            Nenhuma despesa encontrada
          </div>
        )}
      </Main>

      <Footer variant='default'>
        <div className='flex justify-end'>
          <Link to={`/expense/${EPageType.create}`}>
            <Button variant='success' className='flex items-center gap-2'>
              <Plus size={18} /> Nova Despesa
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  );
}

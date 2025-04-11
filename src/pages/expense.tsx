/* eslint-disable react-hooks/exhaustive-deps */
import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EPageType } from '@/enums/EPageType';
import { ICreateExpense, IEditExpense } from '@/interfaces/IExpense';

import {
  CreateExpense,
  EditExpense,
  GetExpenseById,
} from '@/services/expense.service';
import { CircleCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function ExpensePage() {
  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (pageType === EPageType.edit && id) {
        await getExpenseById(id);
      }
    };
    fetchData();
  }, []);

  const form = useForm<ICreateExpense | IEditExpense>({
    defaultValues: {
      name: '',
      price: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (pageType === EPageType.create) {
        await createExpense(data);
      } else {
        await editExpense(data as IEditExpense);
      }
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      toast.error('Erro ao salvar a despesa.');
    }
  });

  const createExpense = async (data: ICreateExpense) => {
    const request = await CreateExpense({ ...data });
    if (!request) {
      toast.error('Não foi possível criar a despesa');
      return;
    }
    toast.success('Despesa salva com sucesso!');
    navigate(`/expenses`);
  };

  const editExpense = async (data: IEditExpense) => {
    const request = await EditExpense({
      ...data,
      id: id || '',
    });
    if (!request) {
      toast.error('Não foi possível editar a despesa');
      return;
    }
    toast.success('Despesa atualizada com sucesso!');
    navigate(`/expenses`);
  };

  const getExpenseById = async (expenseId: string) => {
    try {
      const expense = await GetExpenseById(expenseId);
      if (!expense) {
        toast.error('Despesa não encontrada');
        return;
      }
      form.reset({
        name: expense.name || '',
        price: expense.price || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar despesa:', error);
      toast.error('Erro ao carregar os dados da despesa');
    }
  };

  const formatPrice = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    const numberValue = inputValue ? parseInt(inputValue, 10) / 100 : 0;
    onChange(numberValue);
    return formatPrice(numberValue);
  };

  return (
    <>
      <BackButton to='/' />

      <Main>
        <Form {...form}>
          <form className='flex flex-col gap-4'>
            <div className='flex w-full flex-col gap-4 rounded-md border p-2'>
              <h2 className='text-muted-foreground text-xs'>
                Informações da Despesa
              </h2>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        value={formatPrice(field.value)}
                        onChange={(e) => {
                          const formattedValue = handlePriceChange(
                            e,
                            field.onChange,
                          );
                          e.target.value = formattedValue;
                        }}
                        onFocus={(e) => e.target.select()}
                        placeholder='R$ 0,00'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </Main>

      <Footer variant='default'>
        <Button
          type='submit'
          variant='success'
          className='h-full w-full'
          onClick={onSubmit}
        >
          <CircleCheck className='mr-2' /> Salvar Despesa
        </Button>
      </Footer>
    </>
  );
}

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
import {
  CreateIngredientFormData,
  CreateIngredientSchema,
  EditIngredientFormData,
  EditIngredientSchema,
} from '@/schemas/ingredient.schema';
import {
  CreateIngredients,
  EditIngredient,
  GetIngredientById,
} from '@/services/ingredient.service';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function IngredientPage() {
  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (pageType === EPageType.edit && id) {
        await getIngredientById(id);
      }
    };
    fetchData();
  }, []);

  const form = useForm<CreateIngredientFormData | EditIngredientFormData>({
    resolver: zodResolver(
      pageType === EPageType.create
        ? CreateIngredientSchema
        : EditIngredientSchema,
    ),
    defaultValues: {
      name: '',
      sold_price: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (pageType === EPageType.create) {
        await createIngredient(data);
      } else {
        await editIngredient(data);
      }
    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error);
      toast.error('Erro ao salvar o ingrediente.');
    }
  });

  const createIngredient = async (data: CreateIngredientFormData) => {
    const request = await CreateIngredients({ ...data });
    if (!request) {
      toast.error('Não foi possível criar o ingrediente');
      return;
    }
    toast.success('Ingrediente salvo com sucesso!');
    navigate(`/ingredients`);
  };

  const editIngredient = async (data: EditIngredientFormData) => {
    const request = await EditIngredient({
      ...data,
      id: id || '',
    });
    if (!request) {
      toast.error('Não foi possível criar o ingrediente');
      return;
    }
    toast.success('Ingrediente salvo com sucesso!');
    navigate(`/ingredients`);
  };

  const getIngredientById = async (ingredientId: string) => {
    try {
      const ingredient = await GetIngredientById(ingredientId);
      if (!ingredient) {
        toast.error('Ingrediente não encontrado');
        return;
      }
      form.reset({
        name: ingredient.name || '',
        sold_price: ingredient.sold_price || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar ingrediente:', error);
      toast.error('Erro ao carregar os dados do ingrediente');
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
      <BackButton to='/ingredients' />

      <Main>
        <Form {...form}>
          <form className='flex flex-col gap-4'>
            <div className='bingredient flex w-full flex-col gap-4 rounded-md p-2'>
              <h2 className='text-muted-foreground text-xs'>
                Informações do Ingrediente
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
                name='sold_price'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Preço por (kg)</FormLabel>
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
          <CircleCheck className='mr-2' /> Salvar Ingrediente
        </Button>
      </Footer>
    </>
  );
}

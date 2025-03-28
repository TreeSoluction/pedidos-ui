import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EPageType } from '@/enums/EPageType';
import { IProduct } from '@/interfaces/IProducts';
import {
  CreateOrderFormData,
  CreateOrderSchema,
  EditOrderFormData,
  EditOrderSchema,
} from '@/schemas/order.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, useNavigate, useParams } from 'react-router';

export default function RequestPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);

  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  const form = useForm<CreateOrderFormData | EditOrderFormData>({
    resolver: zodResolver(
      pageType === EPageType.create ? CreateOrderSchema : EditOrderSchema,
    ),
    defaultValues: {
      address: '',
      name: '',
    },
  });

  const createOrder = async (data: CreateOrderFormData) => {};

  const editOrder = async (data: EditOrderFormData) => {};

  const onSubmit = () =>
    form.handleSubmit(async (data) => {
      try {
        if (pageType === EPageType.create) {
          await createOrder(data);
        } else {
          await editOrder(data);
        }
      } catch (error) {
        console.error('Erro ao salvar pedido:', error);
      }
    });

  return (
    <>
      <BackButton />

      <Main>
        <Form {...form}>
          <form className='flex flex-col gap-4'>
            <div className='flex w-full flex-col gap-4 rounded-md border p-2'>
              <h2 className='text-muted-foreground text-xs'>
                Informações do Pedido
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
                name='address'
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
            </div>
          </form>
        </Form>
      </Main>

      <Footer variant='default'>
        {pageType === EPageType.create && (
          <Button
            type='submit'
            variant='success'
            className='h-full w-full'
            onClick={onSubmit}
          >
            <CircleCheck className='mr-2' /> Salvar Pedido
          </Button>
        )}

        {pageType === EPageType.edit && <></>}
      </Footer>
    </>
  );
}

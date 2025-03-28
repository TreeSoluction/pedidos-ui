import { BackButton } from '@/components/back';
import { Drawer } from '@/components/drawer';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import {
  CardProducts,
  CardProductsWithDetails,
} from '@/components/products/card';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EPageType } from '@/enums/EPageType';
import { ICategory } from '@/interfaces/ICategories';
import { IProduct, IProductSelected } from '@/interfaces/IProducts';
import {
  CreateOrderFormData,
  CreateOrderSchema,
  EditOrderFormData,
  EditOrderSchema,
} from '@/schemas/order.schema';
import { GetAllCategories } from '@/services/category.service';
import { GetAllProducts } from '@/services/product.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, PackagePlus } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function RequestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSelectedProduct, setIsOpenSelectedProduct] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [preSelectedProducts, setPreSelectedProducts] =
    useState<IProduct | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<IProductSelected[]>(
    [],
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [observation, setObservation] = useState<string>('');

  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getAllProducts();
    };

    fetchData();
  }, []);

  const getAllProducts = async () => {
    const categoriesData = await GetAllCategories();
    const request = await GetAllProducts();

    const enrichedProducts = request.map((product: IProduct) => {
      const category = categoriesData.find(
        (cat: ICategory) => cat.id === product.category_id,
      );
      return {
        ...product,
        category: category || null,
      };
    });

    setProducts(enrichedProducts);
  };

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

  const handleDrawer = () => setIsOpen((s) => !s);
  const handleSelectProductDrawer = () => setIsOpenSelectedProduct((s) => !s);

  const handleSelectProduct = (product: IProduct) => {
    setPreSelectedProducts(product);
    setQuantity(1);
    setObservation('');
    handleDrawer();
    handleSelectProductDrawer();
  };

  const addSelectedProduct = () => {
    if (!preSelectedProducts) {
      toast('Selecione um produto antes de adicionar.');

      return;
    }

    const data: IProductSelected = {
      ...preSelectedProducts,
      observation,
      quantity,
    };

    setSelectedProducts((s) => [...s, data]);

    setPreSelectedProducts(null);
    setQuantity(1);
    setObservation('');
    setIsOpenSelectedProduct(false);
  };

  const removeSelectedProduct = (index: number) => {
    setSelectedProducts((s) => s.filter((_, i) => i !== index));
  };

  const cancelSelectedProduct = () => {
    setPreSelectedProducts(null);
    setQuantity(1);
    setObservation('');
    setIsOpenSelectedProduct(false);
  };

  const totalPrice = preSelectedProducts
    ? (preSelectedProducts.buy_price * quantity).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : 'R$ 0,00';

  const unitPrice = preSelectedProducts
    ? preSelectedProducts.buy_price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : 'R$ 0,00';

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
                    <FormLabel>Endereço</FormLabel>
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

        {selectedProducts.length > 0 && (
          <div className='my-4 flex flex-col gap-2'>
            <h1 className='text-sm'>Produtos selecionados</h1>

            {selectedProducts.map((product, index) => (
              <CardProductsWithDetails
                productData={product}
                key={index}
                onRemove={() => {
                  removeSelectedProduct(index);
                }}
              />
            ))}
          </div>
        )}

        <div>
          <button className='absolute right-2 bottom-18 rounded-full bg-green-500 p-2'>
            <PackagePlus onClick={handleDrawer} />
          </button>

          <Drawer
            open={isOpen}
            position='bottom'
            onClose={handleDrawer}
            variant='secondary'
          >
            <div className='mb-4'>
              <h3 className='text-base font-medium'>Selecione um produto</h3>
            </div>

            <div className='h-[400px] overflow-scroll'>
              {products.map((product) => (
                <Fragment key={product.id}>
                  <div
                    onClick={() => {
                      handleSelectProduct(product);
                    }}
                  >
                    {product.name}
                  </div>
                </Fragment>
              ))}
            </div>
          </Drawer>
        </div>

        <Drawer
          open={isOpenSelectedProduct}
          position='bottom'
          onClose={handleSelectProductDrawer}
          variant='secondary'
          closeButton={false}
        >
          {preSelectedProducts && (
            <>
              <CardProducts
                productData={preSelectedProducts}
                navigable={false}
              />

              <div className='my-4 flex flex-col gap-4'>
                <div>
                  <Label htmlFor='quantity' className='mb-1'>
                    Quantidade
                  </Label>
                  <Input
                    type='number'
                    id='quantity'
                    value={quantity === 0 ? '' : quantity}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      setQuantity(inputValue === '' ? 0 : Number(inputValue));
                    }}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (isNaN(value) || value < 1) {
                        setQuantity(1);
                      }
                    }}
                    min={1}
                  />
                </div>

                <div>
                  <Label htmlFor='observation' className='mb-1'>
                    Observação
                  </Label>
                  <Textarea
                    placeholder='Ex: Bem passado, sem sal...'
                    id='observation'
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>
              </div>

              <div className='mt-4 flex w-full flex-col items-end'>
                <p className='text-muted-foreground flex items-center gap-1'>
                  Valor total:
                  <span className='text-lg font-semibold text-black'>
                    {totalPrice}
                  </span>
                </p>
                <p className='text-muted-foreground text-sm'>
                  Valor un.: {unitPrice}
                </p>
              </div>

              <div className='mt-4 flex w-full gap-2'>
                <Button variant={'destructive'} onClick={cancelSelectedProduct}>
                  Cancelar
                </Button>
                <Button variant={'success'} onClick={addSelectedProduct}>
                  Adicionar
                </Button>
              </div>
            </>
          )}
        </Drawer>
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

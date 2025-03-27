import { BackButton } from '@/components/back';
import { Drawer } from '@/components/drawer';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EPageType } from '@/enums/EPageType';
import { ICategory } from '@/interfaces/ICategories';
import {
  CreateProductFormData,
  CreateProductSchema,
  EditProductFormData,
  EditProductSchema,
} from '@/schemas/product.schema';
import { GetAllCategories } from '@/services/category.service';
import {
  CreateProduct,
  EditProduct,
  GetProductById,
} from '@/services/product.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

export default function ProductPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  const form = useForm<CreateProductFormData | EditProductFormData>({
    resolver: zodResolver(
      pageType === EPageType.create ? CreateProductSchema : EditProductSchema,
    ),
    defaultValues: {
      category: '',
      name: '',
      buy_price: '',
      sold_price: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await GetAllCategories();
        setCategories(categoriesData);

        if (id) {
          const product = await GetProductById(id);
          if (product) {
            form.reset({
              category: product.category_id || '',
              name: product.name || '',
              buy_price: product.buy_price
                ? formatCurrency((product.buy_price * 100).toString())
                : '',
              sold_price: product.sold_price
                ? formatCurrency((product.sold_price * 100).toString())
                : '',
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, [id, pageType, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (pageType === EPageType.create) {
        await createProduct(data);
      } else {
        await editProduct(data);
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  });

  const createProduct = async (data: CreateProductFormData) => {
    const request = await CreateProduct({
      category: {
        connect: {
          id: data.category,
        },
      },
      name: data.name,
      buy_price: data.buy_price ? parseCurrency(data.buy_price) : undefined,
      sold_price: data.sold_price ? parseCurrency(data.sold_price) : undefined,
    });

    if (request) {
      navigate('/products');
    }
  };

  const editProduct = async (data: EditProductFormData) => {
    const request = await EditProduct(
      {
        category: {
          connect: {
            id: data.category,
          },
        },
        name: data.name,
        buy_price: data.buy_price ? parseCurrency(data.buy_price) : undefined,
        sold_price: data.sold_price
          ? parseCurrency(data.sold_price)
          : undefined,
      },
      id || '',
    );

    if (request) {
      navigate('/products');
    }
  };

  const getSelectedCategoryName = () => {
    const selectedId = form.getValues('category');
    const selectedCategory = categories.find((cat) => cat.id === selectedId);

    if (form.formState.errors.category) {
      return form.formState.errors.category.message as string;
    }

    return selectedCategory
      ? selectedCategory.name
      : 'Nenhuma categoria selecionada';
  };

  const handleDrawer = () => setIsOpen((s) => !s);

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/\D/g, '')) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: (value: string) => void,
  ) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setValue('');
      return;
    }
    setValue(formatCurrency(rawValue));
  };

  const parseCurrency = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
  };

  return (
    <>
      <BackButton />

      <Main>
        <h1 className='mt-2 mb-1 font-semibold'>
          {pageType === EPageType.create
            ? 'Criar Produto'
            : form.getValues('name') || 'Editar Produto'}
        </h1>

        <Form {...form}>
          <form className='flex flex-col gap-4'>
            <div className='flex w-full flex-col gap-4 rounded-md border p-2'>
              <h2 className='text-muted-foreground text-xs'>
                Informações do Produto
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

              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger
                        className={`truncate ${form.formState.errors.category && 'text-red-500'}`}
                      >
                        {getSelectedCategoryName()}
                      </TooltipTrigger>
                      <TooltipContent>
                        {getSelectedCategoryName()}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button type='button' onClick={handleDrawer}>
                    Selecionar Categoria
                  </Button>
                </div>

                <Drawer
                  open={isOpen}
                  position='bottom'
                  onClose={handleDrawer}
                  variant='secondary'
                >
                  <div className='mb-4'>
                    <h3 className='text-base font-medium'>
                      Selecione uma categoria
                    </h3>
                  </div>
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        {categories.map((category) => (
                          <FormItem
                            key={category.id}
                            className='flex items-center gap-2'
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value === category.id}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked ? category.id : undefined,
                                  );
                                  handleDrawer();
                                }}
                                size='lg'
                              />
                            </FormControl>
                            <FormLabel className='cursor-pointer text-lg font-semibold'>
                              {category.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Drawer>
              </div>
            </div>

            <div className='flex w-full flex-col gap-4 rounded-md border p-2'>
              <h2 className='text-muted-foreground text-xs'>Preço</h2>
              <div className='flex w-full gap-2'>
                <FormField
                  control={form.control}
                  name='buy_price'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleInputChange(e, field.onChange)}
                        />
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
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleInputChange(e, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </Main>

      <Footer variant='ghost'>
        <Button
          type='submit'
          variant='success'
          className='h-full w-full'
          onClick={onSubmit}
        >
          <CircleCheck className='mr-2' /> Salvar Produto
        </Button>
      </Footer>
    </>
  );
}

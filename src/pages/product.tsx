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
import { IProduct } from '@/interfaces/IProducts';
import {
  CreateProductFormData,
  CreateProductSchema,
  EditProductFormData,
  EditProductSchema,
} from '@/schemas/product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export default function ProductPage() {
  const [product, setProduct] = useState<IProduct>();
  const [categories, setCategories] = useState<ICategory[]>([
    { id: '1', name: 'Categoria 1' },
    { id: '2', name: 'Categoria 2' },
    { id: '3', name: 'Categoria 3' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();

  const getDefaultValues = () => {
    return {
      category: '',
      name: '',
      buy_price: undefined,
      purchase_price: undefined,
    } as CreateProductFormData | EditProductFormData;
  };

  const form = useForm<CreateProductFormData | EditProductFormData>({
    resolver: zodResolver(
      pageType === EPageType.create ? CreateProductSchema : EditProductSchema,
    ),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    const fetchData = async () => {
      await getProduct();
    };

    if (id) {
      fetchData();
    } else {
      console.log('Não existe id');
    }
  }, [id]);

  const onSubmit = async (
    data: CreateProductFormData | EditProductFormData,
  ) => {
    if (pageType === EPageType.create) {
      await createProduct(data);
    } else {
      await editProduct(data);
    }
  };

  const createProduct = async (data: CreateProductFormData) => {
    console.log('Criando produto:', data);
  };

  const editProduct = async (data: EditProductFormData) => {
    console.log('Editando produto:', data);
  };

  const getProduct = async () => {};

  const getSelectedCategoryName = () => {
    const selectedId = form.getValues('category');
    const selectedCategory = categories.find((cat) => cat.id === selectedId);
    return selectedCategory
      ? selectedCategory.name
      : 'Nenhuma categoria selecionada';
  };

  const handleDrawer = () => setIsOpen((s) => !s);

  return (
    <>
      <BackButton />

      <Main>
        <h1 className='mt-2 mb-1 font-semibold'>
          {pageType === EPageType.create ? 'Criar Produto' : product?.name}
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
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
                      <TooltipTrigger className='truncate'>
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
          </form>
        </Form>
      </Main>

      <Footer variant='ghost'>
        <Button type='submit' variant='success' className='h-full w-full'>
          <CircleCheck className='mr-2' /> Salvar Produto
        </Button>
      </Footer>
    </>
  );
}

import { BackButton } from '@/components/back';
import { Drawer } from '@/components/drawer';
import { Footer } from '@/components/footer';
import { QuantityInput } from '@/components/ingredients/card';
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
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EPageType } from '@/enums/EPageType';
import { ICategory } from '@/interfaces/ICategories';
import { IIngredient, IIngredientInProduct } from '@/interfaces/IIngredients';
import {
  CreateProductFormData,
  CreateProductSchema,
  EditProductFormData,
  EditProductSchema,
} from '@/schemas/product.schema';
import { GetAllCategories } from '@/services/category.service';
import { GetAllIngredients } from '@/services/ingredient.service';
import {
  CreateProduct,
  EditProduct,
  GetProductById,
} from '@/services/product.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChefHat, CircleCheck } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

export default function ProductPage() {
  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<IIngredient[]>(
    [],
  );
  const [selectedIngredients, setSelectedIngredients] = useState<
    IIngredientInProduct[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isIngredientsOpen, setIngredientsIsOpen] = useState(false);
  const [searchName, setSearchName] = useState<string>('');

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
        const ingredientsData = await GetAllIngredients();
        setCategories(categoriesData);
        setIngredients(ingredientsData);
        setFilteredIngredients(ingredientsData);

        if (id) {
          const product = await GetProductById(id);
          if (product) {
            form.reset({
              category: product.category_id || '',
              name: product.name || '',
              buy_price: product.buy_price
                ? formatCurrency(product.buy_price * 100)
                : '',
              sold_price: product.sold_price
                ? formatCurrency(product.sold_price * 100)
                : '',
            });

            const productIngredients = product.product_ingredients || [];
            const selectedIngredients = productIngredients.map(
              (productIngredient: {
                ingredient_id: string;
                quantity: number;
              }) => {
                const ingredient = ingredientsData.find(
                  (ingredient: { id: string }) =>
                    ingredient.id === productIngredient.ingredient_id,
                );
                return {
                  ...ingredient,
                  quantity: productIngredient.quantity,
                };
              },
            );

            setSelectedIngredients(selectedIngredients);

            setIngredients((prev) =>
              prev.filter(
                (ingredient) =>
                  !productIngredients.some(
                    (productIngredient: { ingredient_id: string }) =>
                      productIngredient.ingredient_id === ingredient.id,
                  ),
              ),
            );

            setFilteredIngredients((prev) =>
              prev.filter(
                (ingredient) =>
                  !productIngredients.some(
                    (productIngredient: { ingredient_id: string }) =>
                      productIngredient.ingredient_id === ingredient.id,
                  ),
              ),
            );
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, [id, pageType, form]);

  useEffect(() => {
    if (!ingredients) return;

    let result = [...ingredients];

    if (searchName) {
      result = result.filter((order) =>
        (order.name || 'Sem nome')
          .toLowerCase()
          .includes(searchName.toLowerCase()),
      );
    }

    setFilteredIngredients(result);
  }, [ingredients, searchName]);

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
      category: data.category,
      name: data.name,
      buy_price: data.buy_price ? parseCurrency(data.buy_price) : undefined,
      sold_price: data.sold_price ? parseCurrency(data.sold_price) : undefined,
      ingredients: selectedIngredients,
    });

    if (request) {
      navigate('/products');
    }
  };

  const editProduct = async (data: EditProductFormData) => {
    const request = await EditProduct(
      {
        category: data.category,
        name: data.name,
        buy_price: data.buy_price ? parseCurrency(data.buy_price) : undefined,
        sold_price: data.sold_price
          ? parseCurrency(data.sold_price)
          : undefined,
        ingredients: selectedIngredients,
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

  const handleIngredientsDrawer = () => setIngredientsIsOpen((s) => !s);

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', {
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

    const numericValue = parseFloat(rawValue.replace(/\D/g, ''));

    if (!isNaN(numericValue)) {
      setValue(formatCurrency(numericValue));
    }
  };

  const parseCurrency = (value: string) => {
    return Number(value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
  };

  const handleSelectIngredient = (data: IIngredient) => {
    setSelectedIngredients((s) => {
      const alreadyExists = s.some((ingredient) => ingredient.id === data.id);
      if (alreadyExists) return s;

      return [...s, { ...data, quantity: 0 }];
    });

    setIngredients((prev) =>
      prev.filter((ingredient) => ingredient.id !== data.id),
    );
    setFilteredIngredients((prev) =>
      prev.filter((ingredient) => ingredient.id !== data.id),
    );

    handleIngredientsDrawer();
  };

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.filter((ingredient) => ingredient.id !== id),
    );

    setIngredients((prev) => {
      const removedIngredient = selectedIngredients.find(
        (ing) => ing.id === id,
      );
      return removedIngredient ? [...prev, removedIngredient] : prev;
    });

    setFilteredIngredients((prev) => {
      const removedIngredient = selectedIngredients.find(
        (ing) => ing.id === id,
      );
      return removedIngredient ? [...prev, removedIngredient] : prev;
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, quantity } : ingredient,
      ),
    );
  };

  const formatPrice = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const totalCost = selectedIngredients.reduce((acc, ingredient) => {
    const ingredientCost = (ingredient.quantity / 1000) * ingredient.sold_price;
    return acc + ingredientCost;
  }, 0);

  return (
    <>
      <BackButton to='/products' />

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
                  name='sold_price'
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
                  name='buy_price'
                  render={() => (
                    <FormItem className='w-full'>
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          value={formatPrice(totalCost)}
                          disabled
                          placeholder='R$ 0,00'
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

        <div className='flex w-full flex-col gap-4 rounded-md border p-2'>
          <h2 className='text-muted-foreground text-xs'>Ingredientes</h2>

          {selectedIngredients.map((ingredient) => (
            <QuantityInput
              ingredient={ingredient}
              onQuantityChange={handleQuantityChange}
              onRemoveIngredient={handleRemoveIngredient}
              key={ingredient.id}
            />
          ))}
        </div>
      </Main>

      <div>
        <button
          onClick={handleIngredientsDrawer}
          className='absolute right-2 bottom-18 flex gap-2 rounded-full bg-green-500 p-2'
        >
          <ChefHat />
          <div>Adicionar ingrediente</div>
        </button>

        <Drawer
          open={isIngredientsOpen}
          position='bottom'
          onClose={handleIngredientsDrawer}
          variant='secondary'
        >
          <div className='mb-4'>
            <h3 className='text-base font-medium'>Selecione um ingrediente</h3>
          </div>

          <div className='rounded-md border p-2'>
            <Label htmlFor='search' className='text-muted-foreground mb-1'>
              Buscar por nome
            </Label>
            <Input
              id='search'
              placeholder='Digite o nome do ingrediente...'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <div className='h-[400px] overflow-scroll'>
            {filteredIngredients.map((ingredient) => (
              <Fragment key={ingredient.id}>
                <div
                  onClick={() => {
                    handleSelectIngredient(ingredient);
                  }}
                  className='flex cursor-pointer items-center justify-between border-b p-3 transition-colors hover:bg-gray-100'
                >
                  <div className='flex flex-col'>
                    <span className='font-semibold text-gray-800'>
                      {ingredient.name}
                    </span>
                  </div>
                  <span className='text-sm text-gray-500'>Selecionar</span>
                </div>
              </Fragment>
            ))}
          </div>
        </Drawer>
      </div>

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

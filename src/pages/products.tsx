import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { CardProducts } from '@/components/products/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EPageType } from '@/enums/EPageType';
import { ICategory } from '@/interfaces/ICategories';
import { IProduct } from '@/interfaces/IProducts';
import { GetAllCategories } from '@/services/category.service';
import { GetAllProducts } from '@/services/product.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function ProductsPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        await getAllProducts();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getAllProducts = async () => {
    const categoriesData = await getAllCategories();
    const productsData = await GetAllProducts();
    const enrichedProducts = productsData.map((product: IProduct) => {
      const category = categoriesData.find(
        (cat: ICategory) => cat.id === product.category_id,
      );
      return {
        ...product,
        category: category || null,
      };
    });

    setProducts(enrichedProducts);
    setFilteredProducts(enrichedProducts);
  };

  const getAllCategories = async (): Promise<ICategory[]> => {
    const request = await GetAllCategories();

    setCategories(request);

    return request;
  };

  const changeCategory = (e: string) => {
    if (e === 'all') {
      setFilteredProducts(products);

      return;
    }

    const data = products.filter((product) => product.category_id === e);

    setFilteredProducts(data);
  };

  return (
    <>
      <BackButton />

      <Main className='flex flex-col gap-2'>
        <div className='rounded-md border p-2'>
          <Label htmlFor='category' className='text-muted-foreground mb-1'>
            Categorias
          </Label>
          <Select onValueChange={(e) => changeCategory(e)} defaultValue='all'>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Categoria' />
            </SelectTrigger>
            <SelectContent id='category'>
              <SelectItem value='all'>Todos</SelectItem>

              {categories.map((category) => (
                <SelectItem value={category.id} key={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div>Carregando produtos...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardProducts productData={product} key={product.id} />
          ))
        ) : (
          <div>Nenhum produto encontrado</div>
        )}
      </Main>

      <Footer variant='default'>
        <div className='flex justify-end'>
          <Link to={`/product/${EPageType.create}`}>
            <Button>
              <Plus /> Novo Produto
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  );
}

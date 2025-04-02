/* eslint-disable react-hooks/exhaustive-deps */
import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { CardProducts } from '@/components/products/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { DeleteProduct, GetAllProducts } from '@/services/product.service';
import { ChefHat, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    } else {
      const data = products.filter((product) => product.category_id === e);
      setFilteredProducts(data);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const searchedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(term),
    );
    setFilteredProducts(searchedProducts);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await DeleteProduct(id);

      toast.success('Produto excluído com sucesso!');

      getAllProducts();
    } catch (error) {
      console.log(error);
      toast.error('Não foi possível excluir o produto.');
    }
  };

  return (
    <>
      <BackButton to='/' />

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

        <div className='rounded-md border p-2'>
          <Label htmlFor='search' className='text-muted-foreground mb-1'>
            Buscar por nome
          </Label>
          <Input
            id='search'
            placeholder='Digite o nome do lanche...'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div>Carregando produtos...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardProducts
              productData={product}
              key={product.id}
              navigable={true}
              onRemove={handleDeleteProduct}
            />
          ))
        ) : (
          <div>Nenhum produto encontrado</div>
        )}
      </Main>

      <Footer variant='default'>
        <div className='flex justify-between'>
          <Link to={`/ingredients`}>
            <Button>
              <ChefHat /> Ingredientes
            </Button>
          </Link>

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

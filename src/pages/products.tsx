import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { CardProducts } from '@/components/products/card';
import { Button } from '@/components/ui/button';
import { EPageType } from '@/enums/EPageType';
import { ICategory } from '@/interfaces/ICategories';
import { IProduct } from '@/interfaces/IProducts';
import { GetAllCategories } from '@/services/category.service';
import { GetAllProducts } from '@/services/product.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
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
    const categoriesData = await GetAllCategories();
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
  };

  return (
    <>
      <BackButton />

      <Main className='flex flex-col gap-2'>
        {isLoading ? (
          <div>Carregando produtos...</div>
        ) : products.length > 0 ? (
          products.map((product) => (
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

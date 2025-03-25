import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ChefHat, FileText, Package2 } from 'lucide-react';
import { Link } from 'react-router';

export default function HomePage() {
  return (
    <>
      <Footer>
        <div className='flex w-full flex-wrap items-center justify-center gap-4'>
          <Link to={'reports'}>
            <Button>
              <FileText />
              Relatórios
            </Button>
          </Link>

          <Link to={'products'}>
            <Button>
              <Package2 />
              Produtos
            </Button>
          </Link>

          <Link to={'requests'}>
            <Button>
              <ChefHat />
              Pedidos
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  );
}

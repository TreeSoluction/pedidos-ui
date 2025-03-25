import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import { EPageType } from '@/enums/EPageType';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';

export default function ProductsPage() {
  return (
    <>
      <BackButton />

      <Main></Main>

      <Footer>
        <div>
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

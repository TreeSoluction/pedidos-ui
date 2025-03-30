import { ProgressPlots } from '@/components/charts/pie.chats';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import { GetDiarySold, GetWeekSold } from '@/services/plots.service';
import { ChefHat, FileText, Package2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function HomePage() {
  const [weekSold, setWeekSold] = useState<{
    goal: number;
    reach: number;
  }>();
  const [diarySold, setDiarySold] = useState<{
    goal: number;
    reach: number;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      await getWeekSold();
      await getDiarySold();
    };

    fetchData();
  }, []);

  const getWeekSold = async () => {
    const request = await GetWeekSold();

    setWeekSold(request);
  };

  const getDiarySold = async () => {
    const request = await GetDiarySold();

    setDiarySold(request);
  };

  return (
    <>
      <Main className='mt-4 flex flex-col gap-4'>
        {weekSold && (
          <ProgressPlots
            goal={weekSold.goal}
            reach={weekSold.reach}
            title='Meta da Semana'
          />
        )}

        {diarySold && (
          <ProgressPlots
            goal={diarySold.goal}
            reach={diarySold.reach}
            title='Meta do Dia'
          />
        )}
      </Main>

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

          <Link to={'orders'}>
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

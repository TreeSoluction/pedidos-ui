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
        <div className='flex w-full max-w-lg flex-col gap-2 px-1'>
          <div className='p flex w-full justify-evenly'>
            <Link to={'reports'} className='mx-1 flex-1'>
              <Button className='w-full'>
                <FileText className='h-5 w-5' />
                <span className='truncate text-sm'>Relatórios</span>
              </Button>
            </Link>

            <Link to={'products'} className='mx-1 flex-1'>
              <Button className='w-full'>
                <Package2 className='h-5 w-5' />
                <span className='truncate text-sm'>Produtos</span>
              </Button>
            </Link>
          </div>
          <div className='flex w-full justify-evenly'>
            <Link to={'expenses'} className='mx-1 flex-1'>
              <Button className='w-full'>
                <Package2 className='h-5 w-5' />
                <span className='truncate text-sm'>Despesas</span>
              </Button>
            </Link>

            <Link to={'orders'} className='mx-1 flex-1'>
              <Button className='w-full'>
                <ChefHat className='h-5 w-5' />
                <span className='truncate text-sm'>Pedidos</span>
              </Button>
            </Link>
          </div>
        </div>
      </Footer>
    </>
  );
}

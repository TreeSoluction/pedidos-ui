/* eslint-disable @typescript-eslint/no-explicit-any */
import { BackButton } from '@/components/back';
import { ProgressPlotsPrice } from '@/components/charts/pie.chats';
import { Main } from '@/components/main';
import { GetDailyProfit } from '@/services/plots.service';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis } from 'recharts';

interface IProfitValue {
  day: string;
  total_cost: number;
  total_sold: number;
}

const dayTranslation: { [key: number]: string } = {
  0: 'Dom',
  1: 'Seg',
  2: 'Terc',
  3: 'Quar',
  4: 'Quin',
  5: 'Sex',
  6: 'Sab',
};

export default function ReportsPage() {
  const [profitValues, setProfitValues] = useState<IProfitValue[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProfit = await GetDailyProfit();
      const profitValues: IProfitValue[] = [];
      fetchedProfit.forEach((profit: any) => {
        profitValues.push({
          day: dayTranslation[profit.day],
          total_cost: profit.total_cost,
          total_sold: profit.total_sold,
        });
      });
      setProfitValues(profitValues);
    };

    fetchData();
  }, []);

  function getTotalProfit(): number {
    let totalProfit = 0;
    profitValues.forEach((value) => {
      totalProfit += value.total_sold - value.total_cost;
    });
    return totalProfit;
  }

  return (
    <>
      <BackButton />

      <Main className='mt-4 flex flex-col gap-2'>
        <ProgressPlotsPrice
          goal={1000}
          reach={getTotalProfit()}
          title='Meta de Lucro Semanal'
        />
        {profitValues && (
          <div className='text flex-col rounded-md border-2 p-1'>
            <BarChart width={350} height={300} data={profitValues}>
              <CartesianGrid strokeDasharray='5 5' />
              <XAxis dataKey={'day'} />
              <Tooltip />
              <Legend />
              <Bar dataKey='total_cost' name={'Custo Total'} fill='#A52A2A' />
              <Bar
                dataKey='total_sold'
                name={'Faturamento Total'}
                fill='#097969'
              />
            </BarChart>
          </div>
        )}
      </Main>
    </>
  );
}

import { BackButton } from '@/components/back';
import { Main } from '@/components/main';

export default function ReportsPage() {
  return (
    <>
      <BackButton />

      <Main className='flex items-center justify-center'>
        <h1 className='text-lg font-semibold'>
          Sem dados o suficiente para gerar relatório
        </h1>
      </Main>
    </>
  );
}

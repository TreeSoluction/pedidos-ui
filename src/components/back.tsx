import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export function BackButton() {
  const navigate = useNavigate();

  const returnToBack = () => {
    navigate(-1);
  };

  return (
    <Button onClick={returnToBack} className='m-2'>
      <ArrowLeft size={32} />
      Voltar
    </Button>
  );
}

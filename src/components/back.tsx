import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

type BackButtonProps = {
  to?: string;
};

export function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button onClick={handleClick} className='m-2'>
      <ArrowLeft size={32} />
      Voltar
    </Button>
  );
}

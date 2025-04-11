import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { CardIngredients } from '@/components/ingredients/card';
import { Main } from '@/components/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EPageType } from '@/enums/EPageType';
import { IIngredient } from '@/interfaces/IIngredients';
import {
  DeleteIngredients,
  GetAllIngredients,
} from '@/services/ingredient.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<IIngredient[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getAllIngredients();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!ingredients) return;

    let result = [...ingredients];

    if (searchName) {
      result = result.filter((order) =>
        (order.name || 'Sem nome')
          .toLowerCase()
          .includes(searchName.toLowerCase()),
      );
    }

    setFilteredIngredients(result);
  }, [ingredients, searchName]);

  const getAllIngredients = async () => {
    const request = await GetAllIngredients();
    setIngredients(request);
    setFilteredIngredients(request);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await DeleteIngredients(id);

      toast.success('Ingrediente excluído com sucesso!');

      await getAllIngredients();
    } catch (error) {
      console.log(error);

      toast.error(
        'Não foi possível excluir o ingrediente. Ele pode estar vinculado a um produto. Verifique e tente novamente.',
      );
    }
  };

  return (
    <>
      <BackButton to='/products' />

      <Main className='flex flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:gap-6'>
          <div className='flex-1'>
            <Input
              placeholder='Pesquisar por nome...'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        {isLoading ? (
          <div className='text-muted-foreground text-center'>
            Carregando Ingredientes...
          </div>
        ) : filteredIngredients.length > 0 ? (
          filteredIngredients.map((ingredient) => (
            <CardIngredients
              ingredientData={ingredient}
              key={ingredient.id}
              navigable={true}
              onRemove={() => handleDeleteClick(ingredient.id)}
            />
          ))
        ) : (
          <div className='text-muted-foreground text-center'>
            Nenhum ingrediente encontrado
          </div>
        )}
      </Main>

      <Footer variant='default'>
        <div className='flex w-full justify-end'>
          <Link to={`/ingredient/${EPageType.create}`}>
            <Button variant='success' className='flex items-center gap-2'>
              <Plus size={18} /> Novo Ingrediente
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  );
}

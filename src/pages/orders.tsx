import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { CardOrders } from '@/components/orders/card';
import { Button } from '@/components/ui/button';
import { EPageType } from '@/enums/EPageType';
import { IOrder } from '@/interfaces/IOrders';
import { GetAllOrders } from '@/services/order.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState();
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await getAllOrders();
    };

    fetchData();
  }, []);

  const getAllOrders = async () => {
    const request = await GetAllOrders();

    setOrders(request);
    setFilteredOrders(request);
  };

  return (
    <>
      <BackButton />

      <Main className='flex flex-col gap-2'>
        {isLoading ? (
          <div>Carregando pedido...</div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <CardOrders orderData={order} key={order.id} />
          ))
        ) : (
          <div>Nenhum pedido encontrado</div>
        )}
      </Main>

      <Footer variant='default'>
        <div className='flex justify-end'>
          <Link to={`/order/${EPageType.create}`}>
            <Button>
              <Plus /> Novo Pedido
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  );
}

import { BackButton } from '@/components/back';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import { CardOrders } from '@/components/orders/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EPageType } from '@/enums/EPageType';
import { IOrder } from '@/interfaces/IOrders';
import { DeleteOrders, GetAllOrders } from '@/services/order.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrder[] | undefined>(undefined);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getAllOrders();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!orders) return;

    let result = [...orders];

    if (searchName) {
      result = result.filter((order) =>
        (order.name || 'Sem nome')
          .toLowerCase()
          .includes(searchName.toLowerCase()),
      );
    }

    const today = new Date();
    if (dateFilter === 'today') {
      result = result.filter(
        (order) =>
          new Date(order.createdAt).toDateString() === today.toDateString(),
      );
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      result = result.filter(
        (order) => new Date(order.createdAt) >= oneWeekAgo,
      );
    }

    setFilteredOrders(result);
  }, [orders, searchName, dateFilter]);

  const getAllOrders = async () => {
    const request = await GetAllOrders();
    setOrders(request);
    setFilteredOrders(request);
  };

  const deleteOrder = async (id: string) => {
    const request = await DeleteOrders(id);

    if (request) {
      await getAllOrders();
    }
  };

  return (
    <>
      <BackButton />

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
          <div className='w-full md:w-40'>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Filtrar por data' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas as datas</SelectItem>
                <SelectItem value='today'>Hoje</SelectItem>
                <SelectItem value='week'>Última semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className='text-muted-foreground text-center'>
            Carregando pedidos...
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <CardOrders
              orderData={order}
              key={order.id}
              navigable={true}
              onRemove={() => {
                deleteOrder(order.id);
              }}
            />
          ))
        ) : (
          <div className='text-muted-foreground text-center'>
            Nenhum pedido encontrado
          </div>
        )}
      </Main>

      <Footer variant='default'>
        <div className='flex justify-end'>
          <Link to={`/order/${EPageType.create}`}>
            <Button variant='success' className='flex items-center gap-2'>
              <Plus size={18} /> Novo Pedido
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  );
}

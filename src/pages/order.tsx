/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { BackButton } from '@/components/back';
import { Drawer } from '@/components/drawer';
import { Footer } from '@/components/footer';
import { Main } from '@/components/main';
import {
  CardProducts,
  CardProductsWithDetails,
} from '@/components/products/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EPageType } from '@/enums/EPageType';
import { ICategory } from '@/interfaces/ICategories';
import { IProduct, IProductSelected } from '@/interfaces/IProducts';
import {
  CreateOrderFormData,
  CreateOrderSchema,
  EditOrderFormData,
  EditOrderSchema,
} from '@/schemas/order.schema';
import { GetAllCategories } from '@/services/category.service';
import { CreateOrders, GetOrderById } from '@/services/order.service';
import { GetAllProducts } from '@/services/product.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, PackagePlus, ReceiptText } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export default function RequestPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSelectedProduct, setIsOpenSelectedProduct] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [preSelectedProducts, setPreSelectedProducts] =
    useState<IProduct | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<IProductSelected[]>(
    [],
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [observation, setObservation] = useState<string>('');

  const { pageType, id } = useParams<{ pageType: EPageType; id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getAllProducts();
    };

    fetchData();
  }, [pageType, id]);

  useEffect(() => {
    const fetchData = async () => {
      if (pageType === EPageType.edit && id) {
        await getOrderById(id);
      }
    };

    fetchData();
  }, [products]);

  const getAllProducts = async () => {
    const categoriesData = await GetAllCategories();
    const request = await GetAllProducts();

    const enrichedProducts = request.map((product: IProduct) => {
      const category = categoriesData.find(
        (cat: ICategory) => cat.id === product.category_id,
      );
      return {
        ...product,
        category: category || null,
      };
    });

    setCategories(categoriesData);

    setProducts(enrichedProducts);
    setFilteredProducts(enrichedProducts);
  };

  const changeCategory = (e: string) => {
    if (e === 'all') {
      setFilteredProducts(products);

      return;
    }

    const data = products.filter((product) => product.category_id === e);

    setFilteredProducts(data);
  };

  const form = useForm<CreateOrderFormData | EditOrderFormData>({
    resolver: zodResolver(
      pageType === EPageType.create ? CreateOrderSchema : EditOrderSchema,
    ),
    defaultValues: {
      address: '',
      name: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (pageType === EPageType.create) {
        await createOrder(data);
      }
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast.error('Erro ao salvar o pedido.');
    }
  });

  const createOrder = async (data: CreateOrderFormData) => {
    if (selectedProducts.length <= 0) {
      toast.error('Selecione pelo menos um produto antes de criar.');

      return;
    }

    const request = await CreateOrders({
      ...data,
      items: selectedProducts,
    });

    if (!request) {
      toast.error('Não foi possível criar o pedido');

      return;
    }

    toast.success('Pedido salvo com sucesso!');

    navigate(`/order/${EPageType.edit}/${request.id}`);
  };

  const getOrderById = async (orderId: string) => {
    try {
      const order = await GetOrderById(orderId);
      if (!order) {
        toast.error('Pedido não encontrado');
        return;
      }

      form.reset({
        name: order.name || '',
        address: order.address || '',
      });

      const enrichedItems = order.items
        .map((item: any) => {
          const product = products.find((p) => p.id === item.product_id);
          if (!product) {
            return null;
          }
          return {
            ...product,
            quantity: item.quantity || 1,
            observation: item.observation || '',
            buy_price: item.buy_price,
          } as IProductSelected;
        })
        .filter(
          (item: IProductSelected): item is IProductSelected => item !== null,
        );

      setSelectedProducts(enrichedItems);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      toast.error('Erro ao carregar os dados do pedido');
    }
  };

  const handleDrawer = () => setIsOpen((s) => !s);

  const handleSelectProductDrawer = () => setIsOpenSelectedProduct((s) => !s);

  const handleSelectProduct = (product: IProduct) => {
    setPreSelectedProducts(product);
    setQuantity(1);
    setObservation('');
    handleDrawer();
    handleSelectProductDrawer();
  };

  const addSelectedProduct = () => {
    if (!preSelectedProducts) {
      toast('Selecione um produto antes de adicionar.');

      return;
    }

    const data: IProductSelected = {
      ...preSelectedProducts,
      observation,
      quantity,
    };

    setSelectedProducts((s) => [...s, data]);

    setPreSelectedProducts(null);
    setQuantity(1);
    setObservation('');
    setIsOpenSelectedProduct(false);
  };

  const removeSelectedProduct = (index: number) => {
    setSelectedProducts((s) => s.filter((_, i) => i !== index));
  };

  const cancelSelectedProduct = () => {
    setPreSelectedProducts(null);
    setQuantity(1);
    setObservation('');
    setIsOpenSelectedProduct(false);
  };

  const totalPrice = preSelectedProducts
    ? (preSelectedProducts.buy_price * quantity).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : 'R$ 0,00';

  const unitPrice = preSelectedProducts
    ? preSelectedProducts.buy_price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : 'R$ 0,00';

  const findAndPrintReceipt = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'],
      });

      console.log('Dispositivo conectado:', device.name);

      const server = await device.gatt?.connect();
      if (!server)
        throw new Error('Não foi possível conectar ao servidor GATT');

      const services = await server.getPrimaryServices();
      console.log('Serviços encontrados:');
      services.forEach((service) => {
        console.log(`- UUID do Serviço: ${service.uuid}`);
      });

      let foundServiceUUID: string | null = null;
      let foundCharacteristicUUID: string | null = null;

      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        console.log(`Características do serviço ${service.uuid}:`);
        characteristics.forEach((characteristic) => {
          console.log(`- UUID da Característica: ${characteristic.uuid}`);
          console.log(
            `  Propriedades: ${characteristic.properties.write ? 'Escrita' : ''} ${characteristic.properties.read ? 'Leitura' : ''}`,
          );
          if (characteristic.properties.write) {
            foundServiceUUID = service.uuid;
            foundCharacteristicUUID = characteristic.uuid;
          }
        });
      }

      if (foundServiceUUID && foundCharacteristicUUID) {
        console.log(
          `Encontrado UUID de escrita - Serviço: ${foundServiceUUID}, Característica: ${foundCharacteristicUUID}`,
        );
        await printWithFoundUUIDs(
          device,
          foundServiceUUID,
          foundCharacteristicUUID,
        );
      } else {
        throw new Error('Nenhuma característica de escrita encontrada.');
      }

      await server.disconnect();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Erro:', error);
      alert(
        `Erro ao buscar ou imprimir: ${errorMessage}. Veja o console para os UUIDs encontrados.`,
      );
    }
  };

  const printWithFoundUUIDs = async (
    device: BluetoothDevice,
    serviceUUID: string,
    characteristicUUID: string,
  ) => {
    try {
      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(serviceUUID);
      if (!service) throw new Error('Serviço não encontrado');

      const characteristic =
        await service.getCharacteristic(characteristicUUID);
      if (!characteristic) throw new Error('Característica não encontrada');

      let receipt = '';
      receipt += '    PEDIDO - LANCHONETE    \n';
      receipt += '----------------------------\n';
      receipt += `Nome: ${form.getValues('name')}\n`;
      receipt += `Endereco: ${form.getValues('address')}\n`;
      selectedProducts.forEach((item, index) => {
        receipt += `${index + 1}. ${item.name.slice(0, 27)}\n`;
        receipt += `    Qtde: ${item.quantity}\n`;
        if (item.observation)
          receipt += '    Obs: ' + item.observation.slice(0, 23) + '\n';
        receipt += '----------------------------\n';
      });
      receipt += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
      receipt += '\n\n\n';

      const encoder = new TextEncoder();
      const header = encoder.encode('\x1B\x40');
      const footer = encoder.encode('\x1D\x56\x00');

      const receiptData = encoder.encode(receipt);
      const chunkSize = 256 - header.length - footer.length;
      const delay = 50;

      async function sendChunkWithDelay(
        characteristic: BluetoothRemoteGATTCharacteristic,
        chunk: Uint8Array<ArrayBuffer>,
      ) {
        await characteristic.writeValue(chunk);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      await characteristic.writeValue(header);

      for (let i = 0; i < receiptData.length; i += chunkSize) {
        const chunk = receiptData.slice(i, i + chunkSize);
        await sendChunkWithDelay(characteristic, chunk);
      }

      await characteristic.writeValue(footer);

      console.log('Impresso com sucesso usando os UUIDs encontrados!');
      await server?.disconnect();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Erro ao imprimir com UUIDs encontrados:', error);
      alert(`Erro ao imprimir: ${errorMessage}`);
    }
  };

  return (
    <>
      <BackButton />

      <Main>
        <Form {...form}>
          <form className='flex flex-col gap-4'>
            <div className='flex w-full flex-col gap-4 rounded-md border p-2'>
              <h2 className='text-muted-foreground text-xs'>
                Informações do Pedido
              </h2>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        {selectedProducts.length > 0 && (
          <div className='my-4 flex flex-col gap-2'>
            <h1 className='text-sm'>Produtos selecionados</h1>

            {selectedProducts.map((product, index) => (
              <CardProductsWithDetails
                productData={product}
                key={index}
                onRemove={() => {
                  removeSelectedProduct(index);
                }}
              />
            ))}
          </div>
        )}

        {pageType === EPageType.create && (
          <div>
            <button className='absolute right-2 bottom-18 rounded-full bg-green-500 p-2'>
              <PackagePlus onClick={handleDrawer} />
            </button>

            <Drawer
              open={isOpen}
              position='bottom'
              onClose={handleDrawer}
              variant='secondary'
            >
              <div className='mb-4'>
                <h3 className='text-base font-medium'>Selecione um produto</h3>
              </div>

              <div className='rounded-md border p-2'>
                <Label
                  htmlFor='category'
                  className='text-muted-foreground mb-1'
                >
                  Categorias
                </Label>
                <Select
                  onValueChange={(e) => changeCategory(e)}
                  defaultValue='all'
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Categoria' />
                  </SelectTrigger>
                  <SelectContent id='category'>
                    <SelectItem value='all'>Todos</SelectItem>

                    {categories.map((category) => (
                      <SelectItem value={category.id} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='h-[400px] overflow-scroll'>
                {filteredProducts.map((product) => (
                  <Fragment key={product.id}>
                    <div
                      onClick={() => {
                        handleSelectProduct(product);
                      }}
                      className='flex cursor-pointer items-center justify-between border-b p-3 transition-colors hover:bg-gray-100'
                    >
                      <div className='flex flex-col'>
                        <span className='font-semibold text-gray-800'>
                          {product.name}
                        </span>
                        <span className='text-muted-foreground text-sm'>
                          {product.category.name}
                        </span>
                      </div>
                      <span className='text-sm text-gray-500'>Selecionar</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </Drawer>
          </div>
        )}

        <Drawer
          open={isOpenSelectedProduct}
          position='bottom'
          onClose={handleSelectProductDrawer}
          variant='secondary'
          closeButton={false}
        >
          {preSelectedProducts && (
            <>
              <CardProducts
                productData={preSelectedProducts}
                navigable={false}
              />

              <div className='my-4 flex flex-col gap-4'>
                <div>
                  <Label htmlFor='quantity' className='mb-1'>
                    Quantidade
                  </Label>
                  <Input
                    type='number'
                    id='quantity'
                    value={quantity === 0 ? '' : quantity}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      setQuantity(inputValue === '' ? 0 : Number(inputValue));
                    }}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (isNaN(value) || value < 1) {
                        setQuantity(1);
                      }
                    }}
                    min={1}
                  />
                </div>

                <div>
                  <Label htmlFor='observation' className='mb-1'>
                    Observação
                  </Label>
                  <Textarea
                    placeholder='Ex: Bem passado, sem sal...'
                    id='observation'
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>
              </div>

              <div className='mt-4 flex w-full flex-col items-end'>
                <p className='text-muted-foreground flex items-center gap-1'>
                  Valor total:
                  <span className='text-lg font-semibold text-black'>
                    {totalPrice}
                  </span>
                </p>
                <p className='text-muted-foreground text-sm'>
                  Valor un.: {unitPrice}
                </p>
              </div>

              <div className='mt-4 flex w-full gap-2'>
                <Button variant={'destructive'} onClick={cancelSelectedProduct}>
                  Cancelar
                </Button>
                <Button variant={'success'} onClick={addSelectedProduct}>
                  Adicionar
                </Button>
              </div>
            </>
          )}
        </Drawer>
      </Main>

      <Footer variant='default'>
        {pageType === EPageType.create && (
          <Button
            type='submit'
            variant='success'
            className='h-full w-full'
            onClick={onSubmit}
          >
            <CircleCheck className='mr-2' /> Salvar Pedido
          </Button>
        )}

        {pageType === EPageType.edit && (
          <>
            <Button
              type='submit'
              variant='success'
              className='h-full w-full'
              onClick={findAndPrintReceipt}
            >
              <ReceiptText className='mr-2' /> Imprimir
            </Button>
          </>
        )}
      </Footer>
    </>
  );
}

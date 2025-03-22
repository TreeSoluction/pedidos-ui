import { PlusIcon, Trash2Icon } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { IProduct, IProductSelected } from './interfaces/IProducts';
import { GetAllProducts } from './services/product.service';

export default function App() {
  const [selectedProducts, setSelectedProducts] = useState<IProductSelected[]>(
    [],
  );
  const [selectInput, setSelectInput] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const asyncRequests = async () => {
      const productsRequest = await GetAllProducts();
      setProducts(productsRequest);
    };

    asyncRequests();
  }, []);

  const handleSelectItem = () => {
    if (selectInput) {
      const selectedOption = products.find(
        (option) => option.id === selectInput,
      );
      if (selectedOption) {
        const newProduct: IProductSelected = {
          ...selectedOption,
          observation: '',
          quantity: quantity,
        };

        setSelectedProducts([...selectedProducts, newProduct]);
        setSelectInput('');
        setQuantity(1);
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, newQuantity: string) => {
    const updatedItems = selectedProducts.map((item, i) =>
      i === index ? { ...item, quantity: parseInt(newQuantity) || 1 } : item,
    );
    setSelectedProducts(updatedItems);
  };

  const handleObservationChange = (index: number, observation: string) => {
    const updatedItems = selectedProducts.map((item, i) =>
      i === index ? { ...item, observation } : item,
    );
    setSelectedProducts(updatedItems);
  };

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
        for (const characteristic of characteristics) {
          console.log(`- UUID da Característica: ${characteristic.uuid}`);
          console.log(
            `  Propriedades: ${characteristic.properties.write ? 'Escrita' : ''} ${characteristic.properties.read ? 'Leitura' : ''}`,
          );
          if (characteristic.properties.write) {
            foundServiceUUID = service.uuid;
            foundCharacteristicUUID = characteristic.uuid;
          }
        }
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
      receipt += `Nome: ${name}\n`;
      receipt += `Endereço: ${address}\n`;

      selectedProducts.forEach((item, index) => {
        receipt += `${index + 1}. ${formatText(item.name, 32)}\n`;
        receipt += `    Qtde: ${item.quantity}\n`;
        if (item.observation) {
          receipt += `    Obs: ${formatText(item.observation, 32)}\n`;
        }
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

  const formatText = (text: string, lineWidth = 32): string => {
    const words = text.split(' ');
    let line = '';
    let formattedText = '';

    words.forEach((word) => {
      if ((line + word).length > lineWidth) {
        formattedText += line.trim() + '\n';
        line = word + ' ';
      } else {
        line += word + ' ';
      }
    });

    formattedText += line.trim() + '\n';
    return formattedText;
  };

  return (
    <main className='flex min-h-screen flex-col items-center bg-gray-100 p-4'>
      <div className='mb-6 w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg'>
        <h1 className='mb-4 text-xl font-semibold text-gray-800'>
          Adicionar Item
        </h1>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-4 md:flex-row'>
            <input
              type='text'
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className='w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2'
              placeholder='Nome de quem pediu'
            />
            <input
              type='text'
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
              className='w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2'
              placeholder='Endereço'
            />
          </div>

          <div className='flex flex-col gap-4 md:flex-row'>
            <select
              name='item'
              value={selectInput}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setSelectInput(event.target.value)
              }
              className='w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2'
            >
              <option value='' disabled>
                Selecione um produto
              </option>
              {products.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <input
              type='number'
              min='1'
              value={quantity}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setQuantity(parseInt(event.target.value))
              }
              className='w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/2'
              placeholder='Quantidade'
            />
          </div>

          <button
            onClick={handleSelectItem}
            className='flex w-full items-center gap-1 rounded-md bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 md:w-auto'
          >
            <PlusIcon /> Adicionar
          </button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className='mb-6 w-full max-w-4xl space-y-4 pb-12 md:pb-0'>
          <h2 className='mb-4 text-lg font-semibold text-gray-800'>
            Produtos Selecionados
          </h2>
          {selectedProducts.map((item, index) => (
            <div
              key={index}
              className='rounded-lg bg-white p-4 shadow-md transition hover:shadow-lg'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-800'>
                  {item.name}
                </h3>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <Trash2Icon />
                </button>
              </div>
              <div className='mt-2 flex items-center gap-4'>
                <label className='text-gray-700'>Quantidade:</label>
                <input
                  type='number'
                  min='1'
                  value={item.quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleQuantityChange(index, e.target.value)
                  }
                  className='w-20 rounded-md border border-gray-300 p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              <div className='mt-2'>
                <label className='text-gray-700'>Observação:</label>
                <textarea
                  value={item.observation || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleObservationChange(index, e.target.value)
                  }
                  className='mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  placeholder='Ex: Bem passado, sem sal...'
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className='fixed bottom-4 left-4 w-[calc(100%-2rem)] max-w-4xl rounded-md bg-blue-500 px-6 py-3 text-white transition duration-200 hover:bg-blue-600 md:static md:mt-4'
        onClick={findAndPrintReceipt}
      >
        IMPRIMIR
      </button>
    </main>
  );
}

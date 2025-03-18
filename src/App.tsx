import { PlusIcon, Trash2Icon, X } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { IItem } from './interfaces/IItems';

export default function App() {
  const [items, setItems] = useState<IItem[]>([]);
  const [selectInput, setSelectInput] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [availableOptions, setAvailableOptions] = useState([
    {
      value: 'cheeseburger',
      label: 'Cheeseburger',
      removable: ['Alface', 'Tomate', 'Cebola', 'Picles', 'Maionese'],
      addable: [
        'Bacon',
        'Queijo Cheddar Extra',
        'Cebola Caramelizada',
        'Jalapeño',
      ],
    },
    {
      value: 'frango_crispy',
      label: 'Frango Crispy',
      removable: ['Alface', 'Molho Especial', 'Tomate'],
      addable: ['Queijo Suíço', 'Bacon', 'Barbecue', 'Cebola Roxa'],
    },
    {
      value: 'hot_dog_classico',
      label: 'Hot Dog Clássico',
      removable: ['Ketchup', 'Mostarda', 'Cebola Picada', 'Relish'],
      addable: ['Queijo Ralado', 'Chili', 'Bacon Bits', 'Maionese Temperada'],
    },
    {
      value: 'sanduiche_vegetariano',
      label: 'Sanduíche Vegetariano',
      removable: [
        'Rúcula',
        'Cenoura Ralada',
        'Molho de Iogurte',
        'Tomate Seco',
      ],
      addable: ['Queijo Feta', 'Azeitonas', 'Pesto', 'Abacate'],
    },
  ]);

  const handleSelectItem = () => {
    if (selectInput) {
      const selectedOption = availableOptions.find(
        (option) => option.value === selectInput,
      );
      if (selectedOption) {
        const newItem: IItem = {
          value: selectedOption.value,
          name: selectedOption.label,
          quantity: parseInt(quantity.toString()),
          removableIngredients: selectedOption.removable || [],
          addableIngredients: selectedOption.addable || [],
          removedIngredients: [],
          addedIngredients: [],
          observation: '',
        };
        setItems([...items, newItem]);
        setAvailableOptions(
          availableOptions.filter((option) => option.value !== selectInput),
        );
        setSelectInput('');
        setQuantity(1);
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    const removedItem = items[index];
    setItems(items.filter((_, i) => i !== index));
    setAvailableOptions([
      ...availableOptions,
      {
        value: removedItem.value,
        label: removedItem.name,
        removable: removedItem.removableIngredients ?? [],
        addable: removedItem.addableIngredients ?? [],
      },
    ]);
  };

  const handleQuantityChange = (index: number, newQuantity: string) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, quantity: parseInt(newQuantity) || 1 } : item,
    );
    setItems(updatedItems);
  };

  const handleRemoveIngredient = (index: number, ingredient: string) => {
    const updatedItems = items.map((item, i) =>
      i === index && item.removableIngredients?.includes(ingredient)
        ? {
            ...item,
            removedIngredients: [
              ...(item.removedIngredients || []),
              ingredient,
            ],
            removableIngredients: item.removableIngredients.filter(
              (ing) => ing !== ingredient,
            ),
          }
        : item,
    );
    setItems(updatedItems);
  };

  const handleAddIngredient = (index: number, ingredient: string) => {
    const updatedItems = items.map((item, i) =>
      i === index && item.addableIngredients?.includes(ingredient)
        ? {
            ...item,
            addedIngredients: [...(item.addedIngredients || []), ingredient],
            addableIngredients: item.addableIngredients.filter(
              (ing) => ing !== ingredient,
            ),
          }
        : item,
    );
    setItems(updatedItems);
  };

  const handleUndoRemoveIngredient = (index: number, ingredient: string) => {
    const updatedItems = items.map((item, i) =>
      i === index
        ? {
            ...item,
            removedIngredients: item.removedIngredients?.filter(
              (ing) => ing !== ingredient,
            ),
            removableIngredients: [
              ...(item.removableIngredients || []),
              ingredient,
            ],
          }
        : item,
    );
    setItems(updatedItems);
  };

  const handleUndoAddIngredient = (index: number, ingredient: string) => {
    const updatedItems = items.map((item, i) =>
      i === index
        ? {
            ...item,
            addedIngredients: item.addedIngredients?.filter(
              (ing) => ing !== ingredient,
            ),
            addableIngredients: [
              ...(item.addableIngredients || []),
              ingredient,
            ],
          }
        : item,
    );
    setItems(updatedItems);
  };

  const handleObservationChange = (index: number, observation: string) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, observation } : item,
    );
    setItems(updatedItems);
  };

  const findAndPrintReceipt = async () => {
    try {
      // Conectar ao dispositivo Bluetooth
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Lista todos os dispositivos para exploração inicial
      });

      console.log('Dispositivo conectado:', device.name);

      const server = await device.gatt?.connect();
      if (!server)
        throw new Error('Não foi possível conectar ao servidor GATT');

      // Explorar serviços
      const services = await server.getPrimaryServices();
      console.log('Serviços encontrados:');
      services.forEach((service) => {
        console.log(`- UUID do Serviço: ${service.uuid}`);
      });

      // Tentar encontrar uma característica de escrita
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

  // Função de impressão com UUIDs encontrados
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
      items.forEach((item, index) => {
        receipt += `${index + 1}. ${item.name.slice(0, 27)}\n`;
        receipt += `   Qtde: ${item.quantity}\n`;
        if (item.removedIngredients?.length)
          receipt +=
            '   Sem: ' + item.removedIngredients.join(', ').slice(0, 23) + '\n';
        if (item.addedIngredients?.length)
          receipt +=
            '   + ' + item.addedIngredients.join(', ').slice(0, 25) + '\n';
        if (item.observation)
          receipt += '   Obs: ' + item.observation.slice(0, 23) + '\n';
        receipt += '----------------------------\n';
      });
      receipt += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
      receipt += '\n\n\n';

      const encoder = new TextEncoder();
      const data = encoder.encode('\x1B\x40' + receipt + '\x1D\x56\x00');
      await characteristic.writeValue(data);

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
    <main className='flex min-h-screen flex-col items-center bg-gray-100 p-4'>
      <div className='mb-6 w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg'>
        <h1 className='mb-4 text-xl font-semibold text-gray-800'>
          Adicionar Item
        </h1>
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
              Selecione um item
            </option>
            {availableOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
            className='w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/4'
            placeholder='Quantidade'
          />
          <button
            onClick={handleSelectItem}
            className='flex w-full items-center gap-1 rounded-md bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600 md:w-auto'
          >
            <PlusIcon /> Adicionar
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className='mb-6 w-full max-w-4xl space-y-4 pb-12 md:pb-0'>
          <h2 className='mb-4 text-lg font-semibold text-gray-800'>
            Itens Selecionados
          </h2>
          {items.map((item, index) => (
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
                <label className='text-gray-700'>Remover Ingrediente:</label>
                <select
                  className='mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleRemoveIngredient(index, e.target.value)
                  }
                  value=''
                >
                  <option value='' disabled>
                    Selecione para remover
                  </option>
                  {item.removableIngredients?.map((ing) => (
                    <option key={ing} value={ing}>
                      {ing}
                    </option>
                  ))}
                </select>
                <div className='mt-1 flex flex-wrap gap-1'>
                  {item.removedIngredients?.map((ing, i) => (
                    <span
                      key={i}
                      className='inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-sm text-red-700'
                    >
                      {ing}
                      <button
                        onClick={() => handleUndoRemoveIngredient(index, ing)}
                        className='ml-1 text-red-500 hover:text-red-700'
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className='mt-2'>
                <label className='text-gray-700'>Adicionar Ingrediente:</label>
                <select
                  className='mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleAddIngredient(index, e.target.value)
                  }
                  value=''
                >
                  <option value='' disabled>
                    Selecione para adicionar
                  </option>
                  {item.addableIngredients?.map((ing) => (
                    <option key={ing} value={ing}>
                      {ing}
                    </option>
                  ))}
                </select>
                <div className='mt-1 flex flex-wrap gap-1'>
                  {item.addedIngredients?.map((ing, i) => (
                    <span
                      key={i}
                      className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-sm text-green-700'
                    >
                      {ing}
                      <button
                        onClick={() => handleUndoAddIngredient(index, ing)}
                        className='ml-1 text-green-500 hover:text-green-700'
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
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

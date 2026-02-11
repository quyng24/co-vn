import { useState } from 'react';
import './App.css'
import { wishes } from './store/data';
import type { Card } from './types/type';
import FanCard from './components/FanCard';

function App() {
  const createCard = () =>
    Array.from({ length: 5 }, () => ({ flipped: false, message: '' }));
  const [cards, setCards] = useState<Card[]>(createCard());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    const newCards = [...cards];
    newCards[index].message =
      wishes[Math.floor(Math.random() * wishes.length)];

    setCards(newCards);
    setSelectedIndex(index);
  };

  return (
    <>
      <div className='w-full min-h-screen flex flex-col justify-center items-center gap-5 bg-linear-to-br from-pink-300 to-yellow-200'>
        <FanCard cards={cards} selectedIndex={selectedIndex} onSelect={handleSelect} />
      </div>
    </>
  )
}

export default App

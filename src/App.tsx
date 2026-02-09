import { useState } from 'react';
import './App.css'
import StartButton from './components/StartButton';
import FlipCard from './components/FlipCard';

function App() {
  const wishes = [
    "Chúc bạn code không bug 🚀",
    "Lương tăng gấp đôi 💰",
    "Pass mọi interview 🔥",
    "Sức khỏe dồi dào 💪",
    "Tình duyên nở rộ 🌸",
    "Gia đình bình an ❤️",
    "Năm mới thành công rực rỡ ✨",
  ];
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const handleStart = () => {
    if (flipped) {
      setFlipped(false);
      return;
    }

    const random =
      wishes[Math.floor(Math.random() * wishes.length)];

    setMessage(random);
    setFlipped(true);
  };
  return (
    <>
      <div className='w-full min-h-screen flex flex-col justify-center items-center gap-5 bg-linear-to-br from-pink-300 to-yellow-200'>
        <FlipCard flipped={flipped} message={message} />
        <StartButton onClick={handleStart} flipped={flipped} />
      </div>
    </>
  )
}

export default App

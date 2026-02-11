import { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import FanCard from "../components/FanCard"
import type { Card } from "../types/type";
import { wishes } from "../store/data";
import { useNavigate } from "react-router-dom";

const RandomPuzzle = () => {
    const createCard = () =>
        Array.from({ length: 5 }, () => ({ flipped: false, message: '' }));
    const [cards, setCards] = useState<Card[]>(createCard());
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const nav = useNavigate();
    
    const handleSelect = (index: number) => {
        if (selectedIndex === index) {
            setSelectedIndex(null);
            return;
        }

        const newCards = [...cards];
        newCards[index].message = wishes[Math.floor(Math.random() * wishes.length)];

        setCards(newCards);
        setSelectedIndex(index);
    };

    return (
        <div>
            <button onClick={() => nav("/")} className="absolute top-5 left-5 flex items-center gap-3 border-2 border-black p-2 rounded shadow-2xl hover:border-red-500 hover:text-red-500"><IoArrowBackOutline /> Back Home</button>
            <FanCard cards={cards} selectedIndex={selectedIndex} onSelect={handleSelect} />
        </div>
    )
}

export default RandomPuzzle;
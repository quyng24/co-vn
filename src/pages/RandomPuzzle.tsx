import { useState } from "react";
import FanCard from "../components/FanCard"
import type { Card } from "../types/type";
import { wishes } from "../store/data";

const RandomPuzzle = () => {
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
        newCards[index].message = wishes[Math.floor(Math.random() * wishes.length)];

        setCards(newCards);
        setSelectedIndex(index);
    };

    return (
        <div className="z-50">
            <FanCard cards={cards} selectedIndex={selectedIndex} onSelect={handleSelect} />
        </div>
    )
}

export default RandomPuzzle;
import type { Card } from "../types/type";
import FlipCard from "./FlipCard";

type Props = {
    cards?: Card[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
}

export default function FanCard({cards = [], selectedIndex, onSelect}: Props) {
    const count = cards.length;
    const middle = (count - 1) / 2;
    const spreadStep = 10;
    const offsetStep = 34;

    return (
        <div
            className="relative w-full max-w-5xl h-[clamp(250px,46vw,430px)] flex items-end justify-center px-2 sm:px-4"
        >
            {cards.map((card, i) => {
                const rotate = (i - middle) * spreadStep;
                const offset = (i - middle) * offsetStep;

                return (
                    <FlipCard
                        key={i}
                        flipped={selectedIndex === i}
                        message={card.message}
                        onClick={() => onSelect(i)}
                        style={{
                            width: "clamp(100px, 23vw, 170px)",
                            height: "clamp(150px, 34vw, 255px)",
                            transform: `translateX(${offset}px) rotate(${rotate}deg)`,
                            transformOrigin: "bottom center",
                            zIndex: selectedIndex === i ? 50 : i,
                        }}
                    />
                );
            })}
        </div>
    )
}

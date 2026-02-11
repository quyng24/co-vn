import { useLayoutEffect, useRef, useState } from "react";
import type { Card } from "../types/type";
import FlipCard from "./FlipCard";

type Props = {
    cards?: Card[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
}

export default function FanCard({cards = [], selectedIndex, onSelect}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(400);

    useLayoutEffect(() => {
        const resize = () => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
        }
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const count = cards.length;
    const middle = (count - 1) / 2;
    const spread = width * 0.12;
    const offsetStep = width * 0.09;
    return (
        <div ref={containerRef} className="relative w-full max-w-105 h-70 flex items-end justify-center">
            {cards.map((card, i) => {
                const rotate = (i - middle) * (spread / middle);
                const offset = (i - middle) * offsetStep;

                return (
                <FlipCard
                    key={i}
                    flipped={selectedIndex === i}
                    message={card.message}
                    onClick={() => onSelect(i)}
                    style={{
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

import type { CSSProperties } from 'react';
import ImgLixi from "../assets/image-lixi.jpeg";

type Props = {
  flipped?: boolean;
  message?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function FlipCard({ flipped, message, style, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        absolute w-20 h-40 lg:w-50 lg:h-75 perspective
        transition-transform duration-300
        ${flipped ? "-translate-y-60 z-50" : "translate-y-0"}
      `}
      style={style}
    >
      {/* wrapper xoay */}
      <div
        className={`
          relative w-full h-full
          transform-style-preserve-3d
          transition-transform duration-700 delay-300
          ${flipped ? "rotate-y-180" : ""}
        `}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded bg-white shadow-xl flex items-center justify-center text-2xl">
          <img src={ImgLixi} alt="Images" className="w-full h-full bg-cover bg-center" />
        </div>

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded bg-[#fb222d] border-2 border-yellow-300 shadow-xl flex items-center justify-center text-center p-3 text-yellow-300 text-sm font-medium">
          <span
            className={`
              transition-opacity duration-0 delay-1000
              ${flipped ? "opacity-100" : "opacity-0"}
            `}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

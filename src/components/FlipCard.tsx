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
        absolute perspective
      `}
      style={style}
    >
      <div
        className={`
          w-full lg:w-60 h-full lg:h-90 transition-transform duration-300
        `}
        style={flipped ? { transform: "translateY(calc(-1 * clamp(88px, 24vw, 160px)))" } : undefined}
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
          <div className="absolute inset-0 backface-hidden rounded-xl bg-white shadow-xl overflow-hidden flex items-center justify-center text-2xl">
            <img src={ImgLixi} alt="Images" className="w-full h-full bg-cover bg-center" />
          </div>

          {/* Back */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl bg-linear-to-br from-[#d41922] via-[#fb222d] to-[#b91c1c] border-4 border-double border-yellow-400 shadow-[0_0_20px_rgba(251,34,45,0.4)] flex items-center justify-center text-center p-6 overflow-hidden">
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-yellow-200/50 opacity-50"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-yellow-200/50 opacity-50"></div>
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <span
              className={`
                relative z-10
                font-serif italic leading-relaxed
                text-yellow-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]
                transition-all duration-700 ease-out
                ${flipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{
                fontSize: 'clamp(1rem, 5vw, 1.5rem)',
                textShadow: '1px 1px 0px #851111, 2px 2px 0px #851111'
              }}
            >
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

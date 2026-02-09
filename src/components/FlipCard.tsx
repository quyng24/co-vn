type Props = {
    flipped?: boolean;
    message?: string;
}

export default function FlipCard({ flipped, message }: Props) {
  return (
    <div className="w-72 h-44 perspective">
      <div
        className={`
          relative w-full h-full duration-700 transform-style-preserve-3d
          ${flipped ? "rotate-y-180" : ""}
        `}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-white shadow-xl flex items-center justify-center font-semibold">
          🎁 Sẵn sàng nhận lời chúc
        </div>

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl bg-white shadow-xl flex items-center justify-center text-center p-4">
          {message}
        </div>
      </div>
    </div>
  );
}

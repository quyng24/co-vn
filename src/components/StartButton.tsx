type Props = {
    onClick?: () => void;
    flipped?: boolean;
}

export default function StartButton({ onClick, flipped }: Props) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 rounded-xl bg-black text-white hover:opacity-80"
    >
      {flipped ? "Rút lại" : "Bắt đầu"}
    </button>
  );
}

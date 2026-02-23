import { useState, useRef, useCallback } from "react";
import { IoRefreshOutline } from "react-icons/io5";

interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
}

const hexagrams = [
    { title: "ĐẠI CÁT", desc: "Vạn sự hanh thông, hỷ sự lâm môn." },
    { title: "TRUNG BÌNH", desc: "An nhiên tự tại, giữ vững tâm thế." },
    { title: "TÀI LỘC", desc: "Tiền bạc rủng rỉnh, lộc lá đầy nhà." },
    { title: "TÌNH DUYÊN", desc: "Duyên lành chớm nở, hạnh phúc bền lâu." },
    { title: "CÔNG DANH", desc: "Sự nghiệp thăng tiến, bảng vàng danh giá." },
    { title: "BÌNH AN", desc: "Thân tâm an lạc, tai qua nạn khỏi." },
];

export default function ShakeOracle() {
    const [result, setResult] = useState<{ title: string; desc: string } | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedStick, setSelectedStick] = useState<number | null>(null);

    const tubeRef = useRef<HTMLDivElement>(null);
    const sticksRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lastShake = useRef(0);
    const baseline = useRef(0);
    const warmUp = useRef(true);
    const rotation = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });
    const raf = useRef<number | null>(null);

    const animate = useCallback(() => {
        rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.1;
        rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.1;

        if (tubeRef.current) {
            tubeRef.current.style.transform = `rotateX(${15 + rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
        }
        raf.current = requestAnimationFrame(animate);
    }, []);

    const stopListening = useCallback(() => {
        window.removeEventListener("devicemotion", handleMotion);
        if (raf.current) cancelAnimationFrame(raf.current);
        setIsListening(false);
        warmUp.current = true;
        setIsAnimating(false);
        setSelectedStick(null);
        setResult(null);
    }, []);

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (isAnimating) return;
        const acc = event.accelerationIncludingGravity;
        if (!acc) return;

        const x = acc.x ?? 0;
        const y = acc.y ?? 0;
        const z = acc.z ?? 0;
        const total = Math.sqrt(x * x + y * y + z * z);

        if (warmUp.current) {
            baseline.current = total;
            warmUp.current = false;
            return;
        }

        const delta = Math.abs(total - baseline.current);
        targetRotation.current = { x: (y - 5) * 3, y: x * 3 };

        // Rung lắc tự nhiên cho các thẻ quẻ
        sticksRefs.current.forEach((stick, i) => {
            if (!stick) return;
            const intensity = Math.min(delta / 15, 1.5);
            const vibrate = Math.sin(Date.now() / 50 + i) * 8 * intensity;
            stick.style.transform = `translateZ(${i * 2}px) rotate(${(i - 6) * 4}deg) translateY(${vibrate}px)`;
        });

        const now = Date.now();
        if (delta > 22 && now - lastShake.current > 3000) {
            lastShake.current = now;
            setIsAnimating(true);
            const index = Math.floor(Math.random() * 12);
            setSelectedStick(index);

            setTimeout(() => {
                setResult(hexagrams[Math.floor(Math.random() * hexagrams.length)]);
                setIsListening(false);
            }, 2000);
        }
    }, [isAnimating]);

    const requestPermission = async () => {
        try {
            const DeviceMotion = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;
            if (typeof DeviceMotion.requestPermission === "function") {
                const permission = await DeviceMotion.requestPermission();
                if (permission !== "granted") return;
            }
            window.addEventListener("devicemotion", handleMotion);
            raf.current = requestAnimationFrame(animate);
            setIsListening(true);
        } catch {
            alert("Trình duyệt không hỗ trợ cảm biến chuyển động.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-amber-100 overflow-hidden relative font-serif">
            <div className="text-center z-10 mb-32">
                <h1 className="text-lg font-semibold tracking-[0.2em] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] mb-2 text-transparent bg-clip-text bg-linear-to-b from-yellow-200 to-amber-500">
                    LINH VẬT CHIÊM QUẺ
                </h1>
            </div>

            {/* 3D SCENE */}
            <div className="relative w-48 h-52 flex items-center justify-center" style={{ perspective: "1500px" }}>
                <div ref={tubeRef} className="relative w-40 h-64 transition-transform duration-150 ease-out" style={{ transformStyle: "preserve-3d" }}>

                    {/* Sticks Container */}
                    <div className="absolute inset-x-0 -top-24 flex justify-center" style={{ transformStyle: "preserve-3d" }}>
                        {[...Array(13)].map((_, i) => (
                            <div
                                key={i}
                                ref={(el) => { sticksRefs.current[i] = el; }}
                                className={`absolute w-4 h-60 rounded-t-full border-x border-amber-900/30 shadow-lg transition-all
                  ${selectedStick === i ? "animate-stick-out z-50" : "bg-linear-to-b from-amber-200 to-orange-300"}
                `}
                                style={{
                                    transformOrigin: "bottom center",
                                    transform: `translateZ(${i * 2}px) rotate(${(i - 6) * 4}deg)`,
                                    boxShadow: "inset 1px 0 2px rgba(255,255,255,0.3), 2px 5px 10px rgba(0,0,0,0.3)"
                                }}
                            >
                                <div className="w-full h-8 bg-red-700 rounded-t-full mt-1 flex items-center justify-center text-[8px] text-amber-200 font-bold">福</div>
                            </div>
                        ))}
                    </div>

                    {/* Bamboo Tube (Ống Tre) */}
                    <div className="absolute inset-0 bg-linear-to-r from-[#4a3022] via-[#8b5a2b] to-[#4a3022] rounded-b-[40px] rounded-t-xl border-x-4 border-yellow-800/50 shadow-2xl" style={{ transform: "translateZ(30px)" }}>
                        {/* Họa tiết trên ống */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="w-24 h-24 border-4 border-amber-200 rotate-45 flex items-center justify-center">
                                <span className="text-4xl -rotate-45 font-bold">吉</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 inset-x-0 h-1 bg-black/20" />
                        <div className="absolute bottom-8 inset-x-0 h-1 bg-black/20" />
                    </div>
                </div>
            </div>

            {!isListening ? (
                <button
                    onClick={requestPermission}
                    className="mt-10 group relative px-8 py-2 bg-linear-to-b from-amber-300 to-amber-600 text-red-950 font-black rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-yellow-500/40 transition-all active:scale-95 overflow-hidden"
                >
                    <span className="relative z-10 text-base tracking-[0.3em]">GIEO QUẺ NGAY</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
            ) : (
                <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                    </div>
                    <p className="text-amber-200/80 animate-pulse tracking-widest uppercase text-sm font-light">Hãy lắc mạnh thiết bị của bạn</p>
                </div>
            )}

            {/* RESULT MODAL */}
            {result && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="relative max-w-sm w-full bg-linear-to-b from-amber-50 to-amber-200 p-1 rounded-2xl shadow-[0_0_100px_rgba(255,191,0,0.5)]">
                        <div className="bg-white/50 border-4 border-red-800 rounded-xl px-8 py-12 text-center flex flex-col items-center">
                            <div className="w-16 h-1 bg-red-800 mb-6" />
                            <h2 className="text-red-800 text-5xl font-black mb-4 tracking-tighter">{result.title}</h2>
                            <p className="text-red-900/80 text-lg leading-relaxed mb-10 font-medium italic">"{result.desc}"</p>
                            <button
                                onClick={stopListening}
                                className="flex items-center gap-2 bg-red-800 text-amber-100 px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg"
                            >
                                <IoRefreshOutline size={20} /> TIẾP TỤC
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes stick-out {
          0% { transform: translateZ(20px) translateY(0) rotateX(0); }
          50% { transform: translateZ(100px) translateY(-350px) rotateX(20deg) scale(1.2); }
          100% { transform: translateZ(150px) translateY(-300px) rotateX(360deg) scale(1.1); }
        }
        .animate-stick-out {
          animation: stick-out 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          background: linear-gradient(to bottom, #fee2e2, #ef4444) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
}
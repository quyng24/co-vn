import { useEffect, useState, useRef, useCallback } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
}

const hexagrams = [
    "Quẻ Đại Cát 🌟",
    "Quẻ Trung Bình ⚖️",
    "Quẻ Tài Lộc 💰",
    "Quẻ Tình Duyên ❤️",
    "Quẻ Công Danh 📈",
    "Quẻ Bình An 🕊️",
];

export default function ShakeOracle() {
    const [result, setResult] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const nav = useNavigate();

    const tubeRef = useRef<HTMLDivElement>(null);
    const sticksRef = useRef<HTMLDivElement>(null);

    const lastShake = useRef(0);
    const isShaking = useRef(false);

    const threshold = 25;
    const cooldown = 2000;

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        const acc = event.accelerationIncludingGravity;
        if (!acc || !acc.x || !acc.y || !acc.z) return;

        const { x, y, z } = acc;
        const total = Math.sqrt(x * x + y * y + z * z);

        if (tubeRef.current) {
            const rotateX = y * 2.5;
            const rotateY = x * 2.5;
            tubeRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        if (sticksRef.current) {
            // Hiệu ứng nảy: Lắc càng mạnh nảy càng cao
            const bounce = total > 12 ? -(total * 1.2) : 0;
            const randomJitter = (Math.random() - 0.5) * 8;

            sticksRef.current.style.transform = `translateY(${bounce}px) translateX(${randomJitter}px)`;
            sticksRef.current.style.transition = "transform 0.05s ease-out";
        }

        const now = Date.now();
        if (total > threshold && now - lastShake.current > cooldown && !isShaking.current) {
            isShaking.current = true;
            lastShake.current = now;

            if ("vibrate" in navigator) navigator.vibrate(200);

            // Hiệu ứng văng quẻ
            if (sticksRef.current) {
                sticksRef.current.style.transform = "translateY(-150px) rotate(15deg)";
                sticksRef.current.style.transition = "transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
            }

            setTimeout(() => {
                const random = hexagrams[Math.floor(Math.random() * hexagrams.length)];
                setResult(random);
                isShaking.current = false;
                stopListening();
            }, 1000);
        }
    }, []);

    const stopListening = () => {
        window.removeEventListener("devicemotion", handleMotion);
        setIsListening(false);
    };

    const requestPermission = async () => {
        try {
            const DeviceMotion = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;
            if (typeof DeviceMotion.requestPermission === "function") {
                const permission = await DeviceMotion.requestPermission();
                if (permission !== "granted") return;
            }
            window.addEventListener("devicemotion", handleMotion);
            setIsListening(true);
            setResult(null);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, [handleMotion]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white text-center p-6 gap-8 overflow-hidden">
            <button
                onClick={() => nav("/")}
                className="absolute top-5 left-5 text-gray-800 flex items-center gap-3 border-2 border-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-800 hover:text-white transition-all"
            >
                <IoArrowBackOutline /> Quay lại
            </button>

            <h1 className="text-3xl font-black uppercase tracking-widest text-red-700 drop-shadow-sm">
                🎋 Linh Vật Gieo Quẻ
            </h1>

            {/* Container Ống Tre */}
            <div className="relative w-56 h-80" style={{ perspective: "1200px" }}>
                <div
                    ref={tubeRef}
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
                >
                    {/* MẶT SAU ỐNG TRE */}
                    <div className="absolute inset-0 bg-yellow-900 rounded-b-3xl rounded-t-lg shadow-inner border-yellow-950 border-2" />

                    {/* CÁC THANH QUẺ (Nằm ở giữa) */}
                    <div
                        ref={sticksRef}
                        className="absolute inset-0 flex items-end justify-center pb-12 z-10"
                    >
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-64 bg-gradient-to-b from-orange-200 to-orange-300 rounded-md shadow-md border border-orange-400/30"
                                style={{
                                    transform: `rotate(${(i - 4.5) * 4}deg) translateX(${i * 2}px)`,
                                    transformOrigin: "bottom center",
                                    marginLeft: "-12px"
                                }}
                            >
                                {/* Chữ trên quẻ tre */}
                                <div className="text-[8px] text-red-800 mt-4 font-bold opacity-40">福</div>
                            </div>
                        ))}
                    </div>

                    {/* MẶT TRƯỚC ỐNG TRE (Che quẻ) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-800 via-yellow-700 to-yellow-900 rounded-b-3xl rounded-t-lg shadow-2xl border-b-8 border-yellow-950 z-20 flex items-center justify-center">
                        {/* Họa tiết trên ống tre */}
                        <div className="w-4/5 h-4/5 border-2 border-yellow-600/30 rounded-xl flex items-center justify-center">
                            <span className="text-yellow-500/20 text-6xl font-serif">🎋</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons & Status */}
            {!isListening && !result && (
                <button
                    onClick={requestPermission}
                    className="px-10 py-4 bg-red-700 text-white font-bold rounded-full shadow-2xl hover:bg-red-600 transition-all active:scale-95 animate-bounce"
                >
                    🙏 BẤM ĐỂ XIN QUẺ
                </button>
            )}

            {isListening && (
                <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30">
                    <p className="text-gray-800 font-bold animate-pulse">Lắc mạnh điện thoại... 📱</p>
                </div>
            )}

            {/* Kết quả Modal */}
            {result && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-50 p-6">
                    <div className="bg-orange-50 text-red-900 p-10 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.2)] max-w-sm w-full border-t-8 border-red-700 animate-in zoom-in duration-300">
                        <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-60 mb-2">Thánh Ý</p>
                        <div className="h-[2px] w-12 bg-red-700 mx-auto mb-6"></div>
                        <h2 className="text-4xl font-black mb-8 leading-tight">{result}</h2>
                        <button
                            onClick={requestPermission}
                            className="w-full py-4 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 shadow-lg transition-colors"
                        >
                            TIẾP TỤC GIEO QUẺ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
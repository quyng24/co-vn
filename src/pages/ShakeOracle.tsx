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
    const [isAnimatingResult, setIsAnimatingResult] = useState(false);
    const nav = useNavigate();

    const tubeRef = useRef<HTMLDivElement>(null);
    const sticksRef = useRef<HTMLDivElement>(null);

    const lastShake = useRef(0);
    const isShaking = useRef(false);

    // Hàm dừng lắng nghe sự kiện (Logic chính bạn cần)
    const stopListening = useCallback(() => {
        window.removeEventListener("devicemotion", handleMotion);
        setIsListening(false);
        isShaking.current = false;

        // Reset vị trí ống tre và quẻ về trạng thái tĩnh
        if (tubeRef.current) tubeRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
        if (sticksRef.current) sticksRef.current.style.transform = "translateY(0px)";

        console.log("Đã dừng lắng nghe cảm biến.");
    }, []);

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (isAnimatingResult) return;

        const acc = event.accelerationIncludingGravity;
        if (!acc || !acc.x || !acc.y || !acc.z) return;

        const { x, y, z } = acc;
        const total = Math.sqrt(x * x + y * y + z * z);

        if (tubeRef.current) {
            const rotateX = (y ?? 0) * 2.5;
            const rotateY = (x ?? 0) * 2.5;
            tubeRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        if (sticksRef.current) {
            const bounce = total > 12 ? -(total * 1.5) : 0;
            const randomJitter = (Math.random() - 0.5) * 10;
            sticksRef.current.style.transform = `translateY(${bounce}px) translateX(${randomJitter}px)`;
        }

        const now = Date.now();
        if (total > 25 && now - lastShake.current > 3000 && !isShaking.current) {
            isShaking.current = true;
            lastShake.current = now;
            if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
            setIsAnimatingResult(true);

            setTimeout(() => {
                const random = hexagrams[Math.floor(Math.random() * hexagrams.length)];
                setResult(random);
                isShaking.current = false;
                // Sau khi có kết quả, tự động ngắt cảm biến để tránh lặp lại
                window.removeEventListener("devicemotion", handleMotion);
                setIsListening(false);
            }, 800);
        }
    }, [isAnimatingResult]);

    const requestPermission = async () => {
        try {
            const DeviceMotion = DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;
            if (typeof DeviceMotion.requestPermission === "function") {
                const permission = await DeviceMotion.requestPermission();
                if (permission !== "granted") {
                    alert("Cần cấp quyền để gieo quẻ!");
                    return;
                }
            }
            window.addEventListener("devicemotion", handleMotion);
            setIsListening(true);
            setResult(null);
            setIsAnimatingResult(false);
        } catch (err) {
            alert("Thiết bị hoặc trình duyệt không hỗ trợ cảm biến.");
        }
    };

    useEffect(() => {
        return () => window.removeEventListener("devicemotion", handleMotion);
    }, [handleMotion]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4ece0] text-gray-800 text-center p-6 gap-8 overflow-hidden font-serif">
            <button
                onClick={() => nav("/")}
                className="absolute top-5 left-5 flex items-center gap-2 border-b border-gray-800 p-1 opacity-60 hover:opacity-100 transition-all"
            >
                <IoArrowBackOutline /> Trang chủ
            </button>

            <div className={`${isAnimatingResult ? 'opacity-20' : 'opacity-100'} transition-opacity duration-500 flex flex-col items-center gap-8`}>
                <h1 className="text-3xl font-bold uppercase tracking-widest text-red-800 mb-40">
                    🎋 Xin Quẻ Linh Ứng
                </h1>

                {/* Container Ống Tre */}
                <div className="relative w-48 h-72" style={{ perspective: "1000px" }}>
                    <div
                        ref={tubeRef}
                        className="relative w-full h-full transition-transform duration-100"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* MẶT SAU (Lòng ống) */}
                        <div className="absolute inset-0 bg-[#5c3d2e] rounded-b-3xl rounded-t-lg shadow-inner border-[#3d2b1f] border-2" />

                        {/* DANH SÁCH QUẺ (Nằm giữa) */}
                        <div
                            ref={sticksRef}
                            className="absolute inset-x-0 -top-20 flex items-end justify-center z-10 pointer-events-none"
                        >
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-60 bg-[#e6ccb2] border border-[#b08968] rounded-sm shadow-sm"
                                    style={{
                                        transform: `rotate(${(i - 5.5) * 4}deg) translateX(${i * 1.5}px)`,
                                        transformOrigin: "bottom center",
                                        marginLeft: "-10px",
                                    }}
                                />
                            ))}
                        </div>

                        {/* MẶT TRƯỚC (Thân ống - hạ thấp xuống một chút để hở quẻ) */}
                        <div className="absolute inset-0 top-10 bg-gradient-to-r from-[#7f5539] via-[#9c6644] to-[#7f5539] rounded-b-3xl rounded-t-md shadow-2xl z-20 flex items-center justify-center border-b-8 border-[#3d2b1f]">
                            <div className="w-4/5 h-4/5 border border-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-white/10 text-6xl">福</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC ĐIỀU KHIỂN (Start / Cancel) */}
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    {!isListening ? (
                        <button
                            onClick={requestPermission}
                            className="px-10 py-4 bg-red-800 text-white font-bold rounded-full shadow-xl active:scale-95 transition-all animate-bounce"
                        >
                            🙏 BẤM ĐỂ BẮT ĐẦU
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-red-200">
                                <p className="text-red-700 font-bold animate-pulse">
                                    📱 Đang chờ cú lắc của bạn...
                                </p>
                            </div>

                            {/* NÚT HỦY (Logic quan trọng) */}
                            <button
                                onClick={stopListening}
                                className="px-6 py-2 bg-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-300 active:scale-95 transition-all text-sm uppercase tracking-widest border border-gray-300 shadow-sm"
                            >
                                ✕ Hủy gieo quẻ
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* HIỆU ỨNG QUẺ BAY VÀ KẾT QUẢ */}
            {isAnimatingResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    {/* Thanh quẻ đang bay hoặc đã hiện kết quả */}
                    <div
                        className={`
                            relative w-20 h-112 bg-[#f5ebe0] border-4 border-[#7f5539] rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]
                            flex flex-col items-center justify-between py-10
                            ${result ? 'scale-100' : 'animate-stick-fly'}
                            transition-transform duration-700 ease-out
                        `}
                    >
                        {/* Họa tiết quẻ */}
                        <div className="w-1 h-16 bg-red-800/20 rounded-full" />

                        {/* Nội dung quẻ (Xoay dọc chữ) */}
                        <div className="flex flex-col items-center gap-4">
                            {result ? (
                                <>
                                    <div className="text-red-800 font-black text-4xl [writing-mode:vertical-rl] tracking-[10px] animate-fade-in">
                                        {result.split(' ')[1]} {result.split(' ')[2] || ''}
                                    </div>
                                    <div className="text-red-600 text-lg font-bold mt-4 uppercase animate-bounce">
                                        {result.split(' ')[0]}
                                    </div>
                                </>
                            ) : (
                                <div className="text-red-800/30 text-2xl font-bold [writing-mode:vertical-rl] animate-pulse">
                                    ĐANG HIỂN LINH
                                </div>
                            )}
                        </div>

                        <div className="w-1 h-16 bg-red-800/20 rounded-full" />

                        {/* Nút đóng */}
                        {result && (
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setIsAnimatingResult(false);
                                }}
                                className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-white text-red-800 px-6 py-2 rounded-full font-bold shadow-lg whitespace-nowrap"
                            >
                                Gieo lại quẻ mới
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes stick-fly {
                    0% { transform: translateY(300px) rotate(0deg) scale(0.5); opacity: 0; }
                    50% { transform: translateY(-100px) rotate(360deg) scale(1.2); opacity: 1; }
                    100% { transform: translateY(0) rotate(720deg) scale(1); opacity: 1; }
                }
                .animate-stick-fly {
                    animation: stick-fly 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
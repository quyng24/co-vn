// src/pages/ShakeOracle.tsx (hoặc bất kỳ đường dẫn nào bạn dùng)

import { useState, useRef, useCallback, useEffect } from "react";
import { IoRefreshOutline } from "react-icons/io5";

export const wishes = [
    "Năm mới chính trực, tinh thần thép, vạn sự như ý.",
    "Chúc sức khỏe dẻo dai, tấn pháp vững vàng.",
    "Khí thế hiên ngang, bách chiến bách thắng.",
    "Võ công thăng tiến, bản lĩnh kiên cường.",
    "Giữ lửa đam mê, kỷ luật bền tâm.",
    "Thân rắn rỏi, tâm nhân hậu đúng chất võ sĩ.",
    "Vượt giới hạn, mỗi ngày thắng chính mình.",
    "Học võ khỏe thân, luyện tâm bình an.",
    "Vững vàng trước sóng gió, như khi đứng tấn.",
    "Đòn chuẩn xác, ý chí bền bỉ, thành công rực rỡ.",
];

export default function ShakeOracle() {
    const [result, setResult] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedStick, setSelectedStick] = useState<number | null>(null);

    const tubeRef = useRef<HTMLDivElement>(null);
    const sticksRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lastShakeTime = useRef(0);
    const accelHistory = useRef<number[]>([]);
    const rafRef = useRef<number | null>(null);

    const rotation = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });

    const handleMotion = useCallback(
        (event: DeviceMotionEvent) => {
            if (isAnimating) return;

            const acc = event.accelerationIncludingGravity;
            if (!acc?.x || !acc?.y || !acc?.z) return;

            const { x, y, z } = acc;
            const total = Math.sqrt(x * x + y * y + z * z);

            // Low-pass filter
            accelHistory.current.push(total);
            if (accelHistory.current.length > 8) accelHistory.current.shift();

            const avg = accelHistory.current.reduce((a, b) => a + b, 0) / accelHistory.current.length;
            const delta = Math.abs(total - avg);

            // Cập nhật góc nghiêng
            targetRotation.current = {
                x: (y - 5) * 2.2,
                y: x * 2.8,
            };

            // Rung que tự nhiên
            sticksRefs.current.forEach((stick, i) => {
                if (!stick) return;
                const phase = Date.now() / 80 + i * 1.6;
                const vibrate = Math.sin(phase) * 6 * (delta / 12);
                const sway = Math.sin(phase * 0.7) * 3 * (delta / 12);

                stick.style.transform = `
          translateZ(${i * 1.8}px)
          rotate(${(i - 5.5) * 4}deg)
          translateY(${vibrate}px)
          translateX(${sway}px)
        `;
            });

            const now = Date.now();
            if (delta > 13 && now - lastShakeTime.current > 2800) {
                lastShakeTime.current = now;
                setIsAnimating(true);

                const chosenIndex = Math.floor(Math.random() * 12);
                setSelectedStick(chosenIndex);

                setTimeout(() => {
                    const wish = wishes[Math.floor(Math.random() * wishes.length)];
                    setResult(wish);
                    setIsListening(false);
                }, 2200);
            }
        },
        [isAnimating]
    );

    const animate = useCallback(() => {
        rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.14;
        rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.14;

        if (tubeRef.current) {
            tubeRef.current.style.transform = `
        rotateX(${12 + rotation.current.x}deg)
        rotateY(${rotation.current.y}deg)
        translateZ(0)
      `;
        }

        rafRef.current = requestAnimationFrame(animate);
    }, []);

    const requestPermission = async () => {
        try {
            const DeviceMotion = DeviceMotionEvent as unknown as {
                requestPermission?: () => Promise<"granted" | "denied">;
            };
            if (typeof DeviceMotion.requestPermission === "function") {
                const permission = await DeviceMotion.requestPermission();
                if (permission !== "granted") {
                    alert("Cần quyền truy cập cảm biến chuyển động.");
                    return;
                }
            }

            accelHistory.current = [];
            window.addEventListener("devicemotion", handleMotion);
            rafRef.current = requestAnimationFrame(animate);
            setIsListening(true);
        } catch (err) {
            alert("Trình duyệt không hỗ trợ hoặc bị từ chối quyền cảm biến.");
        }
    };

    const stopAndReset = useCallback(() => {
        window.removeEventListener("devicemotion", handleMotion);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setIsListening(false);
        setIsAnimating(false);
        setSelectedStick(null);
        setResult(null);
        accelHistory.current = [];
        lastShakeTime.current = 0;
    }, [handleMotion]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, [handleMotion]);

    return (
        <div className="flex flex-col items-center justify-center text-amber-100 overflow-hidden relative font-serif">
            <div className="text-center z-10 mb-40">
                <h2 className="text-md font-semibold tracking-[0.25em] drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] text-transparent bg-clip-text bg-linear-to-b from-yellow-200 to-amber-500">
                    Gieo quẻ đầu năm
                </h2>
                <p className="text-lg font-semibold tracking-[0.25em] drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] text-transparent bg-clip-text bg-linear-to-b from-yellow-200 to-amber-500">2026</p>
            </div>

            {/* 3D SCENE */}
            <div className="relative w-56 h-64 flex items-center justify-center" style={{ perspective: "1800px" }}>
                <div
                    ref={tubeRef}
                    className="relative w-44 h-72 transition-transform duration-80 ease-out"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Sticks */}
                    <div className="absolute inset-x-0 -top-28 flex justify-center" style={{ transformStyle: "preserve-3d" }}>
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                ref={(el) => {
                                    sticksRefs.current[i] = el;
                                }}
                                className={`absolute w-5 h-64 rounded-t-full border-x border-amber-900/40 shadow-xl transition-all duration-100
                  ${selectedStick === i ? "animate-stick-out z-50 bg-linear-to-b! from-red-100 to-red-600" : "bg-linear-to-b from-amber-100 to-orange-300"}
                `}
                                style={{
                                    transformOrigin: "bottom center",
                                    transform: `translateZ(${i * 2}px) rotate(${(i - 5.5) * 4}deg)`,
                                    boxShadow: "inset 1px 0 4px rgba(255,255,255,0.4), 3px 8px 16px rgba(0,0,0,0.4)",
                                }}
                            >
                                <div className="w-full h-9 bg-red-800 rounded-t-full mt-1 flex items-center justify-center text-xs text-amber-100 font-bold tracking-wide">
                                    福
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ống tre */}
                    <div
                        className="absolute inset-0 bg-linear-to-r from-[#3d251a] via-[#7a4a1f] to-[#3d251a] rounded-b-[50px] rounded-t-2xl border-x-4 border-yellow-800/60 shadow-2xl"
                        style={{ transform: "translateZ(40px)" }}
                    >
                        <div className="absolute inset-0 opacity-15 flex items-center justify-center">
                            <div className="w-28 h-28 border-4 border-amber-200/70 rotate-45 flex items-center justify-center">
                                <span className="text-5xl -rotate-45 font-black text-amber-100/80">吉</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isListening ? (
                <button
                    onClick={requestPermission}
                    className="mt-12 group relative px-10 py-3 bg-linear-to-b from-amber-400 to-amber-700 text-red-950 font-black rounded-2xl shadow-2xl hover:shadow-yellow-500/50 transition-all active:scale-95"
                >
                    <span className="relative z-10 text-lg tracking-wider">GIEO QUẺ NGAY</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 rounded-2xl transition-opacity" />
                </button>
            ) : (
                <div className="mt-20 flex flex-col items-center gap-5">
                    <div className="flex gap-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-3 h-3 bg-amber-300 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.18}s` }}
                            />
                        ))}
                    </div>
                    <p className="text-amber-200/90 animate-pulse tracking-widest uppercase text-base font-light">
                        Lắc mạnh thiết bị để bốc quẻ...
                    </p>
                </div>
            )}

            {/* Kết quả */}
            {result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-lg animate-fade-in">
                    <div className="relative max-w-md w-full bg-linear-to-b from-amber-50 to-amber-300 p-1.5 rounded-3xl shadow-[0_0_120px_rgba(255,200,0,0.6)]">
                        <div className="bg-white/60 border-4 border-red-900 rounded-2xl px-10 py-14 text-center flex flex-col items-center">
                            <div className="w-20 h-1.5 bg-red-900 mb-8 rounded" />
                            <p className="text-red-950 text-xl leading-relaxed mb-12 font-medium italic">"{result}"</p>
                            <button
                                onClick={stopAndReset}
                                className="flex items-center gap-3 bg-red-900 text-amber-100 px-10 py-4 rounded-full font-bold hover:bg-red-800 transition-all shadow-xl active:scale-95"
                            >
                                <IoRefreshOutline size={22} /> GIEO LẠI
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style >{`
        @keyframes stick-out {
          0% {
            transform: translateZ(30px) translateY(0) rotateX(0) scale(1);
          }
          40% {
            transform: translateZ(140px) translateY(-280px) rotateX(30deg) scale(1.15);
          }
          100% {
            transform: translateZ(220px) translateY(-340px) rotateX(380deg) scale(1.08);
          }
        }
        .animate-stick-out {
          animation: stick-out 2.3s cubic-bezier(0.25, 0.8, 0.3, 1.2) forwards;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6) !important;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
        </div>
    );
}
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
    const nav = useNavigate();

    const [result, setResult] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [isAnimatingResult, setIsAnimatingResult] = useState(false);

    const tubeRef = useRef<HTMLDivElement>(null);
    const sticksRef = useRef<HTMLDivElement>(null);

    const lastShake = useRef(0);
    const isShaking = useRef(false);

    // inertia system
    const rotation = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0 });
    const animationFrame = useRef<number | null>(null);

    /* ==============================
          INERTIA ANIMATION LOOP
    ============================== */

    const animate = useCallback(() => {
        rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.1;
        rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.1;

        if (tubeRef.current) {
            tubeRef.current.style.transform = `
        rotateX(${rotation.current.x}deg)
        rotateY(${rotation.current.y}deg)
      `;
        }

        animationFrame.current = requestAnimationFrame(animate);
    }, []);

    /* ==============================
          STOP LISTENING
    ============================== */

    const stopListening = useCallback(() => {
        window.removeEventListener("devicemotion", handleMotion);
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current);

        setIsListening(false);
        isShaking.current = false;

        rotation.current = { x: 0, y: 0 };
        targetRotation.current = { x: 0, y: 0 };

        if (tubeRef.current)
            tubeRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
        if (sticksRef.current)
            sticksRef.current.style.transform = "translateY(0px)";
    }, []);

    /* ==============================
          HANDLE MOTION
    ============================== */

    const handleMotion = useCallback(
        (event: DeviceMotionEvent) => {
            if (isAnimatingResult) return;

            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const { x, y, z } = acc;
            const xNum = x ?? 0;
            const yNum = y ?? 0;
            const zNum = z ?? 0;
            const total = Math.sqrt(xNum * xNum + yNum * yNum + zNum * zNum);

            // 3D tilt target
            targetRotation.current = {
                x: yNum * 3,
                y: xNum * 3,
            };

            // Stick vibration physics
            if (sticksRef.current) {
                const intensity = Math.min(total / 25, 1);
                const jitterX = (Math.random() - 0.5) * 20 * intensity;
                const jitterY = -(total * 2) * intensity;

                sticksRef.current.style.transform = `
          translateX(${jitterX}px)
          translateY(${jitterY}px)
          rotate(${jitterX * 0.2}deg)
        `;
            }

            const now = Date.now();

            if (
                total > 25 &&
                now - lastShake.current > 3000 &&
                !isShaking.current
            ) {
                isShaking.current = true;
                lastShake.current = now;

                if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);

                setIsAnimatingResult(true);

                setTimeout(() => {
                    const random =
                        hexagrams[Math.floor(Math.random() * hexagrams.length)];
                    setResult(random);

                    window.removeEventListener("devicemotion", handleMotion);
                    setIsListening(false);
                }, 800);
            }
        },
        [isAnimatingResult]
    );

    /* ==============================
          REQUEST PERMISSION
    ============================== */

    const requestPermission = async () => {
        try {
            const DeviceMotion =
                DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;

            if (typeof DeviceMotion.requestPermission === "function") {
                const permission = await DeviceMotion.requestPermission();
                if (permission !== "granted") {
                    alert("Cần cấp quyền cảm biến.");
                    return;
                }
            }

            window.addEventListener("devicemotion", handleMotion);
            animationFrame.current = requestAnimationFrame(animate);

            setIsListening(true);
            setResult(null);
            setIsAnimatingResult(false);
        } catch {
            alert("Thiết bị không hỗ trợ cảm biến.");
        }
    };

    useEffect(() => {
        return () => {
            window.removeEventListener("devicemotion", handleMotion);
            if (animationFrame.current)
                cancelAnimationFrame(animationFrame.current);
        };
    }, [handleMotion, animate]);

    /* ==============================
          RENDER
    ============================== */

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4ece0] text-gray-800 p-6 overflow-hidden font-serif">

            <button
                onClick={() => nav("/")}
                className="absolute top-5 left-5 flex items-center gap-2 border-b border-gray-800 p-1 opacity-60 hover:opacity-100 transition-all"
            >
                <IoArrowBackOutline /> Trang chủ
            </button>

            <div className={`${isAnimatingResult ? "opacity-20" : "opacity-100"} transition-opacity duration-500 flex flex-col items-center gap-10`}>

                <h1 className="text-3xl font-bold uppercase tracking-widest text-red-800 mb-40">
                    🎋 Xin Quẻ Linh Ứng
                </h1>

                {/* Bamboo Tube */}
                <div
                    className="relative w-48 h-72"
                    style={{ perspective: "1200px" }}
                >
                    <div
                        ref={tubeRef}
                        className="relative w-full h-full transition-transform duration-100"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div className="absolute inset-0 bg-[#5c3d2e] rounded-b-3xl rounded-t-lg shadow-inner border-2 border-[#3d2b1f]" />

                        {/* Sticks */}
                        <div
                            ref={sticksRef}
                            className="absolute inset-x-0 -top-20 flex items-end justify-center z-10 pointer-events-none"
                        >
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-60 bg-[#e6ccb2] border border-[#b08968] rounded-sm shadow-sm"
                                    style={{
                                        transform: `rotate(${(i - 5.5) * 4}deg)`,
                                        transformOrigin: "bottom center",
                                        marginLeft: "-10px",
                                    }}
                                />
                            ))}
                        </div>

                        <div className="absolute inset-0 top-10 bg-gradient-to-r from-[#7f5539] via-[#9c6644] to-[#7f5539] rounded-b-3xl rounded-t-md shadow-2xl z-20 border-b-8 border-[#3d2b1f]" />
                    </div>
                </div>

                {!isListening ? (
                    <button
                        onClick={requestPermission}
                        disabled={isAnimatingResult}
                        className="px-10 py-4 bg-red-800 text-white font-bold rounded-full shadow-xl active:scale-95 transition-all animate-bounce"
                    >
                        🙏 BẤM ĐỂ BẮT ĐẦU
                    </button>
                ) : (
                    <div className="text-red-700 font-bold animate-pulse">
                        📱 Hãy lắc điện thoại...
                    </div>
                )}
            </div>

            {/* RESULT OVERLAY */}
            {isAnimatingResult && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    style={{ perspective: "1200px" }}
                >
                    <div
                        className={`relative w-24 h-120 bg-[#f5ebe0] border-4 border-[#7f5539] rounded-lg shadow-2xl flex flex-col items-center justify-center py-10
            ${result ? "scale-100" : "animate-stick-pop-3d"}
            transition-transform duration-700 ease-out`}
                    >
                        {result ? (
                            <div className="text-red-800 font-black text-3xl text-center px-4">
                                {result}
                            </div>
                        ) : (
                            <div className="text-red-800/40 text-xl animate-pulse">
                                ĐANG HIỂN LINH
                            </div>
                        )}

                        {result && (
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setIsAnimatingResult(false);
                                    stopListening();
                                }}
                                className="absolute -bottom-16 bg-white text-red-800 px-6 py-2 rounded-full font-bold shadow-lg"
                            >
                                Gieo lại
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes stick-pop-3d {
          0% {
            transform: translateY(200px) translateZ(-200px) rotateX(0deg) rotateY(0deg) scale(0.4);
            opacity: 0;
          }
          40% {
            transform: translateY(-120px) translateZ(200px) rotateX(180deg) rotateY(90deg) scale(1.2);
            opacity: 1;
          }
          70% {
            transform: translateY(20px) translateZ(50px) rotateX(360deg) rotateY(180deg) scale(1.05);
          }
          100% {
            transform: translateY(0) translateZ(0) rotateX(360deg) rotateY(360deg) scale(1);
          }
        }
        .animate-stick-pop-3d {
          animation: stick-pop-3d 1s cubic-bezier(.22,.68,0,1.01) forwards;
        }
      `}</style>
        </div>
    );
}

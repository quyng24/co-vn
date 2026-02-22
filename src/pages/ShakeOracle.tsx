import { useEffect, useState, useRef, useCallback } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface DeviceMotionEventWithPermission extends DeviceMotionEvent {
    requestPermission?: () => Promise<"granted" | "denied">;
}

const hexagrams = [
    "ĐẠI CÁT",
    "TRUNG BÌNH",
    "TÀI LỘC",
    "TÌNH DUYÊN",
    "CÔNG DANH",
    "BÌNH AN",
];

export default function ShakeOracle() {
    const nav = useNavigate();

    const [result, setResult] = useState<string | null>(null);
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

    /* =============================
       INERTIA LOOP
    ============================== */

    const animate = useCallback(() => {
        rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.08;
        rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.08;

        if (tubeRef.current) {
            tubeRef.current.style.transform = `
        rotateX(${rotation.current.x}deg)
        rotateY(${rotation.current.y}deg)
      `;
        }

        raf.current = requestAnimationFrame(animate);
    }, []);

    /* =============================
       STOP
    ============================== */

    const stopListening = useCallback(() => {
        window.removeEventListener("devicemotion", handleMotion);
        if (raf.current) cancelAnimationFrame(raf.current);

        setIsListening(false);
        warmUp.current = true;
        baseline.current = 0;

        rotation.current = { x: 0, y: 0 };
        targetRotation.current = { x: 0, y: 0 };

        setTimeout(() => {
            setIsAnimating(false);
            setSelectedStick(null);
            setResult(null);
        }, 600);
    }, []);

    /* =============================
       HANDLE MOTION
    ============================== */

    const handleMotion = useCallback(
        (event: DeviceMotionEvent) => {
            if (isAnimating) return;

            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const x = acc.x ?? 0;
            const y = acc.y ?? 0;
            const z = acc.z ?? 0;
            const total = Math.sqrt(x * x + y * y + z * z);

            // warm-up chống auto trigger
            if (warmUp.current) {
                baseline.current = total;
                warmUp.current = false;
                return;
            }

            const delta = Math.abs(total - baseline.current);

            // cập nhật nghiêng ống
            targetRotation.current = {
                x: y * 2.5,
                y: x * 2.5,
            };

            // rung từng thanh riêng lẻ
            sticksRefs.current.forEach((stick, i) => {
                if (!stick) return;
                const intensity = Math.min(delta / 20, 1);
                const offset =
                    Math.sin(Date.now() / 100 + i) * 6 * intensity +
                    (Math.random() - 0.5) * 4 * intensity;

                stick.style.transform = `
          translateY(${offset}px)
          rotate(${offset * 0.3}deg)
        `;
            });

            const now = Date.now();

            if (delta > 18 && now - lastShake.current > 2500) {
                lastShake.current = now;
                setIsAnimating(true);

                const index = Math.floor(Math.random() * 12);
                setSelectedStick(index);

                setTimeout(() => {
                    setResult(hexagrams[Math.floor(Math.random() * hexagrams.length)]);
                    window.removeEventListener("devicemotion", handleMotion);
                    setIsListening(false);
                }, 1800);
            }
        },
        [isAnimating]
    );

    /* =============================
       REQUEST PERMISSION
    ============================== */

    const requestPermission = async () => {
        try {
            const DeviceMotion =
                DeviceMotionEvent as unknown as DeviceMotionEventWithPermission;

            if (typeof DeviceMotion.requestPermission === "function") {
                const permission = await DeviceMotion.requestPermission();
                if (permission !== "granted") return;
            }

            warmUp.current = true;
            baseline.current = 0;

            window.addEventListener("devicemotion", handleMotion);
            raf.current = requestAnimationFrame(animate);

            setIsListening(true);
        } catch {
            alert("Thiết bị không hỗ trợ cảm biến.");
        }
    };

    useEffect(() => {
        return () => {
            window.removeEventListener("devicemotion", handleMotion);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, [handleMotion, animate]);

    /* =============================
       RENDER
    ============================== */

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-700 via-red-800 to-yellow-600 text-white overflow-hidden relative">

            {/* Trang trí Tết */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_30%_20%,gold,transparent_40%),radial-gradient(circle_at_70%_80%,gold,transparent_40%)]" />

            <button
                onClick={() => nav("/")}
                className="absolute top-5 left-5 flex items-center gap-2 border-b border-white/60 p-1 opacity-70 hover:opacity-100"
            >
                <IoArrowBackOutline /> Trang chủ
            </button>

            <h1 className="text-3xl font-bold tracking-widest mb-12 drop-shadow-lg">
                🎋 XIN QUẺ ĐẦU XUÂN
            </h1>

            {/* ỐNG TRE */}
            <div className="relative w-52 h-80" style={{ perspective: "1200px" }}>
                <div
                    ref={tubeRef}
                    className="relative w-full h-full transition-transform duration-100"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div className="absolute inset-0 bg-[#5c3d2e] rounded-b-3xl rounded-t-lg shadow-inner border-4 border-yellow-900" />

                    <div className="absolute inset-x-0 -top-24 flex items-end justify-center">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                ref={(el) => { sticksRefs.current[i] = el; }}
                                className={`w-3 h-64 bg-yellow-100 border border-yellow-700 rounded-sm shadow-md transition-all duration-500
                ${selectedStick === i
                                        ? "animate-stick-rise z-50"
                                        : ""
                                    }`}
                                style={{
                                    transformOrigin: "bottom center",
                                    marginLeft: "-8px",
                                    transform: `rotate(${(i - 5.5) * 4}deg)`
                                }}
                            />
                        ))}
                    </div>

                    <div className="absolute inset-0 top-12 bg-gradient-to-r from-[#7f5539] via-[#9c6644] to-[#7f5539] rounded-b-3xl shadow-2xl border-b-8 border-yellow-900" />
                </div>
            </div>

            {!isListening ? (
                <button
                    onClick={requestPermission}
                    className="mt-10 px-10 py-4 bg-yellow-400 text-red-900 font-bold rounded-full shadow-2xl hover:scale-105 transition"
                >
                    BẮT ĐẦU GIEO QUẺ
                </button>
            ) : (
                <div className="mt-10 animate-pulse text-lg">
                    Hãy lắc điện thoại thật thành tâm...
                </div>
            )}

            {/* KẾT QUẢ */}
            {result && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-gradient-to-b from-yellow-200 to-yellow-400 text-red-900 px-16 py-20 rounded-xl shadow-[0_0_60px_gold] border-4 border-red-800 text-4xl font-black tracking-widest animate-fade-in">
                        {result}
                        <button
                            onClick={stopListening}
                            className="block mt-8 text-lg bg-red-800 text-white px-6 py-2 rounded-full"
                        >
                            Gieo lại
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes stick-rise {
          0% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(-220px) rotateY(180deg); }
          100% { transform: translateY(-260px) rotateY(360deg); }
        }
        .animate-stick-rise {
          animation: stick-rise 1.8s cubic-bezier(.22,.68,0,1) forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in .6s ease forwards;
        }
      `}</style>
        </div>
    );
}

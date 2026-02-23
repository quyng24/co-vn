import { type ReactNode } from 'react';

const Background = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="relative w-[90%] max-w-2xl min-h-137 h-fit bg-[#1e3a63] border-[6px] border-[#c4a159] shadow-2xl overflow-visible mx-auto my-16">

            {/* --- CÁC THÀNH PHẦN TRANG TRÍ (GIỮ NGUYÊN) --- */}
            {/* Họa tiết góc trên */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-[6px] border-l-[6px] border-[#c4a159] m-2 pointer-events-none">
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c4a159]"></div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-[6px] border-r-[6px] border-[#c4a159] m-2 pointer-events-none">
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#c4a159]"></div>
            </div>

            {/* Banner đỉnh */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="relative bg-red-800 px-4 py-2 border-2 border-[#c4a159] rounded-sm skew-x-[-10deg]">
                    <span className="block text-[#c4a159] font-bold text-sm tracking-widest skew-x-10 whitespace-nowrap">CHÚC MỪNG NĂM MỚI</span>
                    <div className="absolute top-1/2 -left-3 w-3 h-3 bg-red-800 border-l-2 border-b-2 border-[#c4a159] -translate-y-1/2 rotate-45"></div>
                    <div className="absolute top-1/2 -right-3 w-3 h-3 bg-red-800 border-r-2 border-t-2 border-[#c4a159] -translate-y-1/2 rotate-45"></div>
                </div>
            </div>

            {/* Logo Panda (Đã sửa lại vị trí tương đối để không đè nội dung) */}
            <div className="flex justify-center pt-14 pb-6 px-4">
                <div className="relative flex items-center gap-3 p-2 bg-white/20 border-2 border-[#c4a159] rounded-sm shadow-[0_0_15px_rgba(196,161,89,0.3)]">
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#c4a159]"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#c4a159]"></div>
                    <div className="w-10 h-10 background-logo"></div>
                    <p className="text-[#c4a159] font-black text-lg tracking-tighter leading-none">PANDA TAEKWONDO</p>
                </div>
            </div>

            {/* --- VÙNG CHỨA NỘI DUNG CHÍNH --- */}
            <div className="relative z-10 px-8 pb-10 text-white min-h-75">
                {children}
            </div>

            {/* --- TRANG TRÍ PHẦN DƯỚI (Dùng absolute để bám đáy) --- */}
            <div className="absolute -left-10 top-1/3 -translate-y-1/2 background-doi-trai w-20 h-48 z-0"></div>
            <div className="absolute -right-10 top-1/3 -translate-y-1/2 background-doi-phai w-20 h-48 z-0"></div>

            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[6px] border-l-[6px] border-[#c4a159] m-2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[6px] border-r-[6px] border-[#c4a159] m-2 pointer-events-none"></div>

            <div className="background-submain absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 z-30"></div>
        </div>
    );
};

export default Background;
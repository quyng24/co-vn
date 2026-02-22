import { useNavigate } from "react-router-dom";
import BaseCard from "../components/common/BaseCard";
import ImgLixi from "../assets/image-lixi.jpeg";
import ShakeOracle from "../assets/shake-oracle.jpeg";

const HomePage = () => {
    const nav = useNavigate();
    return (
        <div className="w-full flex flex-col items-center justify-center gap-5">
            <div className="w-full lg:w-[30%]">
                <BaseCard
                    title="Random Puzzle"
                    image={ImgLixi}
                    footer={
                        <button
                            onClick={() => nav("/random-puzzle")}
                            className="w-fit text-black p-2 border rounded hover:border-red-500 hover:text-red-500 duration-300"
                        >Random Puzzle</button>} />
            </div>

            <div className="w-full lg:w-[30%]">
                <BaseCard
                    title="Random Puzzle"
                    image={ShakeOracle}
                    footer={
                        <button
                            onClick={() => nav("/shake-oracle")}
                            className="w-fit text-black p-2 border rounded hover:border-red-500 hover:text-red-500 duration-300"
                        >Shake Oracle</button>} />
            </div>
        </div>
    )
}

export default HomePage;
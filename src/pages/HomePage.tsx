import { useNavigate } from "react-router-dom";
import BaseCard from "../components/common/BaseCard";
import ImgLixi from "../assets/image-lixi.jpeg";

const HomePage = () => {
    const nav = useNavigate();
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-[30%]">
                <BaseCard 
                    title="Random Puzzle" 
                    image={ImgLixi} 
                    footer={
                        <button 
                            onClick={() => nav("/random-puzzle")}
                            className="w-fit p-2 border rounded hover:border-red-500 hover:text-red-500 duration-300"
                        >Random Puzzle</button>} />
            </div>
        </div>
    )
}

export default HomePage;
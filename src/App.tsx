import './App.css'
import Background from './components/Background'
import ShakeOracle from './pages/ShakeOracle'
function App() {


  return (
    <>
      <div className="background-main w-full min-h-screen flex flex-col justify-center items-center gap-5 bg-linear-to-br from-yellow-200 to-pink-300 p-5 bg-cover bg-center">
        <Background>
          <ShakeOracle />
        </Background>
      </div>
    </>
  )
}

export default App

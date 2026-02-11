import { Route, Routes } from 'react-router-dom'
import './App.css'
import RandomPuzzle from './pages/RandomPuzzle'
import HomePage from './pages/HomePage'

function App() {
  

  return (
    <>
      <div className='w-full min-h-screen flex flex-col justify-center items-center gap-5 bg-linear-to-br from-yellow-200 to-pink-300 p-5'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/random-puzzle' element={<RandomPuzzle />} />
        </Routes>
      </div>
    </>
  )
}

export default App

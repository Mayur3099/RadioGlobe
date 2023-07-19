import './App.css'
import Navbar from './Navbar';
import HomePage from './HomePage';

function App() {
  return (
    <>
      <div className='bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
        <Navbar />
        <HomePage />
      </div>
    </>
  )
}

export default App

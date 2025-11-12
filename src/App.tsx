import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MintForm  from './components/Dashboard'

function App() {
  const [count, setCount] = useState(0)
  // track wallet address and provide a mint success handler required by MintForm
  const [walletAddress, setWalletAddress] = useState<string>('')

  const handleMintSuccess = (...args: any[]) => {
    // handle mint success (args may vary depending on MintForm implementation)
    console.log('mint successful', ...args)
  }

  return (
    <>
    
      
      <MintForm walletAddress={walletAddress} onMintSuccess={handleMintSuccess} />
    </>
  )
}

export default App

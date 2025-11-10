import { useState } from 'react'
import './App.css'
import MintForm  from './components/Dashboard'
import ConnectWalletSection from './components/ConnectWalletSection'

function App() {
  // track wallet address and provide a mint success handler required by MintForm
  const [walletAddress, setWalletAddress] = useState<string>('')

  const handleMintSuccess = (...args: any[]) => {
    // handle mint success (args may vary depending on MintForm implementation)
    console.log('mint successful', ...args)
  }

  return (
    <div>
      <MintForm walletAddress={walletAddress} onMintSuccess={handleMintSuccess} />
      <ConnectWalletSection {...({ setWalletAddress } as any)} />
    </div>
  )
}

export default App

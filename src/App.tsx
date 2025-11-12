import { useState } from 'react'
import './App.css'
import MintForm  from './components/Dashboard'
import ConnectionWallet from './components/ConnectionWallet'

function App() {
  // track wallet address and provide a mint success handler required by MintForm
  const [walletAddress, setWalletAddress] = useState<string>('')

  const handleMintSuccess = (...args: any[]) => {
    // handle mint success (args may vary depending on MintForm implementation)
    console.log('mint successful', ...args)
  }

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress('')
  }

  return (
    <>
      <ConnectionWallet onWalletConnect={handleWalletConnect} onWalletDisconnect={handleWalletDisconnect} />
      {walletAddress && <MintForm walletAddress={walletAddress} onMintSuccess={handleMintSuccess} />}
    </>
  )
}

export default App

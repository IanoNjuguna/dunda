import { useState, useEffect } from 'react';
import { Music, Wallet, AlertCircle, LayoutGrid, Plus } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function SoundMintConnect() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'connect' | 'dashboard'>('connect');

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setCurrentView('dashboard');
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setWalletAddress(accounts[0]);
      setShowWalletModal(false);
      setCurrentView('dashboard');
      
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress(null);
          setCurrentView('connect');
        } else {
          setWalletAddress(accounts[0]);
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    setError('WalletConnect integration requires additional setup. Please use MetaMask for now.');
  };

  const connectPolkadot = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
      const extensions = await web3Enable('SoundMint');
      
      if (extensions.length === 0) {
        setError('Polkadot.js extension is not installed. Please install it to continue.');
        setIsConnecting(false);
        return;
      }

      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        setError('No Polkadot accounts found. Please create an account first.');
        setIsConnecting(false);
        return;
      }

      setWalletAddress(accounts[0].address);
      setShowWalletModal(false);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Polkadot connection error:', err);
      setError('Failed to connect Polkadot wallet. Make sure Polkadot.js extension is installed.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setError(null);
    setCurrentView('connect');
  };

  const formatAddress = (address: string | null | undefined): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white">
        <header className="flex items-center justify-between px-8 py-6 border-b border-teal-900/30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-slate-900 transition-transform duration-150 group-hover:animate-[shake_0.5s_ease-in-out]" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" 
                     style={{ animationDuration: '1.5s' }} />
              </div>
              <span className="text-xl font-semibold">SoundMint</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-800/50 text-teal-100 rounded-lg border border-teal-700/50">
                <LayoutGrid className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-teal-900/30 text-teal-200 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span className="font-medium">Mint NFT</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-teal-900/50 border border-teal-700/50 rounded-lg">
              <span className="text-sm font-medium">{formatAddress(walletAddress)}</span>
            </div>
            <button 
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 font-medium rounded-lg transition-all duration-200"
            >
              Disconnect
            </button>
          </div>
        </header>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
            75% { transform: rotate(-10deg); }
          }
        `}</style>

        <main className="flex flex-col items-center justify-center px-6 py-20">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-teal-900/40 rounded-full flex items-center justify-center mb-8 border border-teal-700/30">
              <Music className="w-16 h-16 text-teal-400" strokeWidth={1.5} />
            </div>

            <h2 className="text-3xl font-bold mb-3">No NFTs Minted Yet</h2>
            <p className="text-teal-200/70 mb-8 text-center max-w-md">
              Start minting your first music NFT to see it here
            </p>

            <button className="flex items-center gap-2 px-8 py-3 bg-teal-400 hover:bg-teal-500 text-slate-900 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-teal-400/30">
              <Plus className="w-5 h-5" />
              Mint NFT
            </button>
          </div>
        </main>

        <button className="fixed bottom-8 right-8 w-12 h-12 bg-teal-800/60 hover:bg-teal-700/70 backdrop-blur-sm rounded-full flex items-center justify-center border border-teal-600/40 transition-all duration-200 hover:scale-110 shadow-lg">
          <span className="text-teal-100 font-semibold text-lg">?</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white">
      <header className="flex items-center justify-between px-8 py-6 border-b border-teal-900/30">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Music className="w-6 h-6 text-slate-900 transition-transform duration-150 group-hover:animate-[shake_0.5s_ease-in-out]" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" 
                 style={{ animationDuration: '1.5s' }} />
          </div>
          <span className="text-xl font-semibold">SoundMint</span>
        </div>
        
        <button 
          onClick={() => setShowWalletModal(true)}
          className="px-6 py-2.5 bg-teal-400 hover:bg-teal-500 text-slate-900 font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-teal-400/30"
        >
          Connect Wallet
        </button>
      </header>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
      `}</style>

      <main className="flex flex-col items-center justify-center px-6 py-20">
        <div className="relative mb-12">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-teal-700/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-700/50 via-teal-800/60 to-teal-900/70 rounded-full backdrop-blur-md" />
            
            <div className="relative z-10 w-28 h-28 bg-teal-900/70 rounded-3xl flex items-center justify-center border border-teal-600/40 backdrop-blur-sm shadow-xl">
              <Wallet className="w-14 h-14 text-teal-300" strokeWidth={1.8} />
            </div>
            
            <div className="absolute top-2 right-6 w-12 h-12 bg-teal-700/60 rounded-full backdrop-blur-md border border-teal-600/40 flex items-center justify-center animate-bounce shadow-lg"
                 style={{ animationDuration: '3s' }}>
              <Music className="w-5 h-5 text-teal-300" strokeWidth={2} />
            </div>
            
            <div className="absolute bottom-4 left-1 w-9 h-9 bg-teal-800/60 rounded-full backdrop-blur-md border border-teal-600/40 flex items-center justify-center animate-pulse shadow-lg"
                 style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">Connect Your Wallet</h1>
        <p className="text-teal-200/80 text-center max-w-md mb-12 leading-relaxed">
          Get started by connecting your Web3 wallet to mint and sell your music NFTs directly to your fans.
        </p>

        {error && (
          <div className="w-full max-w-md mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="w-full max-w-md mb-8 bg-gradient-to-br from-teal-950/40 to-slate-900/40 backdrop-blur-sm border border-teal-800/30 rounded-2xl p-8">
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-teal-100/70">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
              <span>Upload your tracks and cover art</span>
            </li>
            <li className="flex items-start gap-3 text-teal-100">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
              <span className="font-medium">Set your edition size and pricing</span>
            </li>
            <li className="flex items-start gap-3 text-teal-100/70">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
              <span>Mint NFTs without intermediaries</span>
            </li>
          </ul>
        </div>

        <button 
          onClick={() => setShowWalletModal(true)}
          disabled={isConnecting}
          className="group w-full max-w-md px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-teal-400/40 hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-5 h-5 transition-transform group-hover:scale-110" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </main>

      <button className="fixed bottom-8 right-8 w-12 h-12 bg-teal-800/60 hover:bg-teal-700/70 backdrop-blur-sm rounded-full flex items-center justify-center border border-teal-600/40 transition-all duration-200 hover:scale-110 shadow-lg">
        <span className="text-teal-100 font-semibold text-lg">?</span>
      </button>

      {showWalletModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-700/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Connect Wallet</h2>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="text-teal-200 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <p className="text-teal-200/70 mb-6">Choose your preferred wallet to connect</p>
            
            <div className="space-y-3">
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="w-full p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 border border-orange-500/30 rounded-xl transition-all duration-200 flex items-center gap-4 disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
                  🦊
                </div>
                <div className="text-left">
                  <div className="font-semibold">MetaMask</div>
                  <div className="text-sm text-teal-200/60">Connect using MetaMask</div>
                </div>
              </button>

              <button
                onClick={connectWalletConnect}
                disabled={isConnecting}
                className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/30 rounded-xl transition-all duration-200 flex items-center gap-4 disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div className="text-left">
                  <div className="font-semibold">WalletConnect</div>
                  <div className="text-sm text-teal-200/60">Scan with mobile wallet</div>
                </div>
              </button>

              <button
                onClick={() => setError('Coinbase Wallet integration coming soon!')}
                disabled={isConnecting}
                className="w-full p-4 bg-gradient-to-r from-blue-700/10 to-blue-800/10 hover:from-blue-700/20 hover:to-blue-800/20 border border-blue-700/30 rounded-xl transition-all duration-200 flex items-center gap-4 disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-2xl">
                  💰
                </div>
                <div className="text-left">
                  <div className="font-semibold">Coinbase Wallet</div>
                  <div className="text-sm text-teal-200/60">Connect using Coinbase</div>
                </div>
              </button>

              <button
                onClick={connectPolkadot}
                disabled={isConnecting}
                className="w-full p-4 bg-gradient-to-r from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 border border-pink-500/30 rounded-xl transition-all duration-200 flex items-center gap-4 disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2.5" />
                    <circle cx="5" cy="12" r="2.5" />
                    <circle cx="19" cy="12" r="2.5" />
                    <circle cx="12" cy="19" r="2.5" />
                    <path d="M12 7.5 L12 9.5 M12 14.5 L12 16.5 M7.5 12 L9.5 12 M14.5 12 L16.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Polkadot.js</div>
                  <div className="text-sm text-teal-200/60">Connect using Polkadot</div>
                </div>
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
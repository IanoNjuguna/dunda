import { useState, useEffect } from "react";
import { Music, Wallet as WalletIcon, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import Style from "../styles/connection-wallet.module.css";

declare global {
  interface Window {
    ethereum?: {
      request?: (args: { method: string; params?: any[] } | any) => Promise<any>;
      on?: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}

type Props = {
  onWalletConnect?: (address: string) => void;
  onWalletDisconnect?: () => void;
};

export default function ConnectionWallet({
  onWalletConnect,
  onWalletDisconnect,
}: Props) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isHoveringOrb, setIsHoveringOrb] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window.ethereum !== "undefined" && typeof window.ethereum.request === "function") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          onWalletConnect?.(accounts[0]);
        }
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  };


  const disconnectWallet = () => {
    setWalletAddress(null);
    setError(null);
    onWalletDisconnect?.();
  };

  return (
    <div className={Style.container}>
      {/* SoundMint Header (Figma Design) */}
      <header className={Style.headerFigma} role="banner">
        <div className={Style.headerInner}>
          {/* Logo + Brand + Online Dot */}
          <div className={Style.logoGroup}>
            <div className={Style.logoIconWrapper}>
              <div className={Style.logoIcon}>
                <Music size={24} />
              </div>
              {/* Online Status Dot */}
              <div className={Style.onlineDot}></div>
            </div>
            <div className={Style.brandText}>
              <span className={Style.brandSound}>Sound</span>
              <span className={Style.brandMint}>Mint</span>
            </div>
          </div>

          {/* Connect / Disconnect Button */}
          <div className={Style.headerAction}>
            {walletAddress ? (
              <div className={Style.connectedState}>
                <button
                  onClick={disconnectWallet}
                  className={Style.disconnectBtnHeader}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className={Style.connectBtnHeader}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={Style.main}>
        {/* Wallet Orb Section */}
        <div className={Style.orbContainer}>
          {/* Single main orb (only core circle) - removed extra glow rings */}
           
          {/* Inner circle with wallet icon */}
          <div
            className={`${Style.orbCircle} ${Style.orbCore} ${isHoveringOrb ? Style.orbCoreHover : ""}`}
            onMouseEnter={() => setIsHoveringOrb(true)}
            onMouseLeave={() => setIsHoveringOrb(false)}
          >
            <div className={Style.orbIconWrapper}>
              {walletAddress ? (
                <CheckCircle className={Style.orbIcon} />
              ) : (
                <WalletIcon className={Style.orbIcon} />
              )}
            </div>
          </div>
          
          {/* Floating accent: Sparkles icon (bottom-left) */}
          <div className={`${Style.floatingIcon} ${Style.floatingIconBL}`}>
            <div className={Style.floatingIconCircle}>
              <Sparkles className={Style.floatingIconContent} />
            </div>
          </div>

          {/* Floating accent: Music icon (top-right) */}
          <div className={`${Style.floatingIcon} ${Style.floatingIconTR}`}>
            <div className={Style.floatingIconCircle}>
              <Music className={Style.floatingIconContent} />
            </div>
          </div>
        </div>

        <h1 className={Style.title}>
          {walletAddress ? "Wallet Connected!" : "Connect Your Wallet"}
        </h1>
        <p className={Style.subtitle}>
          {walletAddress
            ? "Your wallet is connected. You can now mint and sell your music NFTs directly to your fans."
            : "Get started by connecting your Web3 wallet to mint and sell your music NFTs directly to your fans."}
        </p>

        {error && (
          <div className={Style.errorBox}>
            <AlertCircle className={Style.alertIcon} />
            <p>{error}</p>
          </div>
        )}

        <div className={Style.featuresBox}>
          <ul>
            <li>Upload your tracks and cover art</li>
            <li>Set your edition size and pricing</li>
            <li>Mint NFTs without intermediaries</li>
          </ul>
        </div>

        {!walletAddress && (
          <button
            onClick={() => setShowWalletModal(true)}
            disabled={isConnecting}
            className={Style.connectMainBtn}
          >
            <WalletIcon className={Style.buttonIcon} />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </main>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className={Style.modal}>
          <div className={Style.modalContent}>
            <div className={Style.modalHeader}>
              <h2>Connect Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className={Style.closeBtn}
              >
                ✕
              </button>
            </div>

            <p className={Style.modalSubtitle}>Choose your preferred wallet</p>

            <div className={Style.walletOptions}>
              <button
                onClick={() => window.open('https://polkadot.js.org/extension/', '_blank')}
                className={Style.walletOption}
              >
                <div className={Style.walletIcon}>⚙️</div>
                <div>
                  <div className={Style.walletName}>Polkadot.js</div>
                  <div className={Style.walletDesc}>Connect using Polkadot.js extension</div>
                </div>
              </button>

              <button
                onClick={() => window.open('https://www.talisman.xyz/', '_blank')}
                className={Style.walletOption}
              >
                <div className={Style.walletIcon}>🎭</div>
                <div>
                  <div className={Style.walletName}>Talisman</div>
                  <div className={Style.walletDesc}>Connect using Talisman wallet</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';

// INTERNAL IMPORT
import Style from "../styles/collection.module.css";
import ConnectionWallet from './ConnectionWallet';

export default function Collection() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const handleWalletConnect = (address: string) => {
    setConnectedWallet(address);
    console.log('Wallet connected:', address);
  };

  const handleWalletDisconnect = () => {
    setConnectedWallet(null);
    console.log('Wallet disconnected');
  };

  return (
    <div className={Style.collectionContainer}>
      <ConnectionWallet 
        onWalletConnect={handleWalletConnect}
        onWalletDisconnect={handleWalletDisconnect}
      />
      {/* Add your collection content here */}
    </div>
  );
}

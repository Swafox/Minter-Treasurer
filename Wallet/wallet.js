import {walletFromMnemonic} from 'minterjs-wallet';
import {generateMnemonic} from 'minterjs-wallet';

export function getWalletAddress(mnemonic) {
    const wallet = walletFromMnemonic(mnemonic);
    return wallet.getAddressString();
}

export function generateWallet() {
    const mnemonic = generateMnemonic();
    return mnemonic;
}

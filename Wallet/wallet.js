import {walletFromMnemonic, generateMnemonic, isValidMnemonic} from 'minterjs-wallet';

export function getWalletAddress(mnemonic) {
    const wallet = walletFromMnemonic(mnemonic);
    return wallet.getAddressString();
}

export function generateWallet() {
    const mnemonic = generateMnemonic();
    return mnemonic;
}

export function isValidMnemonic(mnemonic) {
    const isValid = isValidMnemonic(mnemonic);
    return isValid;
}
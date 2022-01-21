import {issueCheck} from "minter-js-sdk";

export function generateCheck(self_add, mnemonic, password, value, coin) {
    const check = issueCheck({
        seedPhrase: mnemonic,
        password: password,
        nonce: minter.getNonce(self_add),
        chainId: 2,
        coin: coin,
        value: value,
        gasCoin: 0,
        dueBlock: 9999999,
    });
    
    return check;
}

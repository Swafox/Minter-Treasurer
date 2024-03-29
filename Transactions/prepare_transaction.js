import {Minter, TX_TYPE, issueCheck, prepareLink} from "minter-js-sdk";
import { FeePrice } from 'minterjs-util';

const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});
const getFeeValue = (new FeePrice({/* ... */})).getFeeValue;

/*
// Below should be executed by the bot after obtaining the txParams
minter.postTx(txParams, {seedPhrase: 'used wealth upgrade screen earn tone kidney melt width actual usage tag'})
.then(txHash => {
    console.log(`Tx created: ${txHash}`);
}).catch(error => {
    const errorMessage = error.response.data.error.message;
    console.log(`Error: ${errorMessage}`);
});
*/

function getCoinID(coin) {
    return minter.getCoinID(coin);
}

export function send_coin(self_add, dest_add, amount) {
    const txParams = {
        nonce: minter.getNonce(self_add),
        chainId: 2,
        type: TX_TYPE.SEND,
        data: {
            to: dest_add,
            value: amount,
            coin: 0,
        },
        gasCoin: 0,
        payload: '',
    };

    return txParams;
    
}

export function redeem_check(self_add, check) {
    const txParams = {
        nonce: minter.getNonce(self_add),
        chainId: 2,
        type: TX_TYPE.REDEEM_CHECK,
        data: {
            check: check,
        },
        gasCoin: 0,
        
        payload: '',
    };

    return prepareLink(txParams);
    
}

export function delegate(self_add, publicKey, stake) {
    const txParams = {
        nonce: minter.getNonce(self_add),
        chainId: 2,
        type: TX_TYPE.DELEGATE,
        data: {
            publicKey: publicKey,
            coin: 0,
            stake: stake,
        },
        gasCoin: 0,
        payload: '',
    };

    return txParams;
}

export function unbound(self_add, publicKey, coin, stake) {
    const txParams = {
        nonce: minter.getNonce(self_add),
        chainId: 2,
        type: TX_TYPE.UNBOND,
        data: {
            publicKey: publicKey,
            coin: getCoinID(coin),
            stake: stake,
        },
        gasCoin: 0,
        gasPrice: getFeeValue(TX_TYPE.UNBOND),
        payload: '',
    };

    return txParams;
}

export function swap(self_add, sellcoin, buycoin, buyamount) {
    const txParams = {
        nonce: minter.getNonce(self_add),
        chainId: 2,
        type: TX_TYPE.BUY,
        data: {
            coinToSell: getCoinID(sellcoin), 
            coinToBuy: getCoinID(buycoin),
            valueToBuy: getCoinID(buyamount),
        },
        gasCoin: 0,
        gasPrice: getFeeValue(TX_TYPE.BUY),
        payload: '',
    };
    
    return txParams;
}

export function newCheck(amount, pass, seedPhrase, self_add) {
    const check = issueCheck({
        seedPhrase: seedPhrase,
        password: pass,
        nonce: minter.getNonce(self_add),
        chainId: 2,
        coin: 0, // coin id
        value: amount,
        gasCoin: 0, // coin id
        dueBlock: 9999999999,
    });

    return check;
}
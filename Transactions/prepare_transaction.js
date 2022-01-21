import {Minter, TX_TYPE} from "minter-js-sdk";
import {issueCheck} from "minter-js-sdk";
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

export function send_coin(self_add, dest_add, amount, coin) {
    const txParams = {
        nonce: minter.getNonce(self_add),
        chainId: 2,
        type: TX_TYPE.SEND,
        data: {
            to: dest_add,
            value: amount,
            coin: getCoinID(coin),
        },
        gasCoin: 0,
        gasPrice: getFeeValue(TX_TYPE.SEND),
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
        gasPrice: getFeeValue(TX_TYPE.REDEEM_CHECK),
        payload: '',
    };

    return txParams;
    
}

export function delegate(publicKey, coin, stake) {
    const txParams = {
        type: TX_TYPE.DELEGATE,
        data: {
            publicKey: publicKey,
            coin: getCoinID(coin),
            stake: stake,
        },
        gasCoin: 0,
        gasPrice: getFeeValue(TX_TYPE.DELEGATE),
        payload: '',
    };

    return txParams;
}

export function unbound(publicKey, coin, stake) {
    const txParams = {
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

export function swap(sellcoin, buycoin, buyamount) {
    const txParams = {
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
}
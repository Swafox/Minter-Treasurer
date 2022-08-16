// Import custom modules
import { delegate , send_coin, newCheck } from './Transactions/prepare_transaction.js';
import { generateWallet, getWalletAddress, ValidMnemonic } from './Wallet/wallet.js';
import axios from 'axios';

// Import main blockchain module and configure to use testnet
import {Minter} from "minter-js-sdk";
const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});

// Telegram module import
import TelegramBot from 'node-telegram-bot-api';

// Bot token
const token = "/YOUR_BOT_TOKEN_HERE/";

const tokenomics = 10 ** 18;
// Creating the bot through TelegramBot class
const bot = new TelegramBot(token, { polling: true });

// Create a bot that uses 'polling' to fetch new updates
bot.on("polling_error", () => console.log("^ Error above or Missing token"));

// Add event listener to bot -> Text only
// The 'msg' is the received Message from user and
// 'match' is the command parameters

// Fetch latest info about the blockchain + BIP price from coingecko
bot.onText(/\/check (.+)/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data from the regexp

	// Separating data
	const data = resp.split(" ");
	const amount = data[0];
	const passphrase = data[1];
	
	const sign_message = "Use /sign {mneumonic} to sign the transaction";
	bot.sendMessage(chatId, sign_message);

	let mnemonic;
	bot.onText(/\/sign (.+)/, (msg, match) => {
		mnemonic = match[1];
		if (ValidMnemonic(mnemonic)) {
			// Send message to the user
			const self_address = getWalletAddress(mnemonic);
			const message = "🗒️ Here is your check for " + amount + " BIP!\n\n**" + newCheck(100, passphrase, mnemonic, self_address); + "**";
			bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
		} else {
			// Send message to the user
			bot.sendMessage(chatId, 'Mnemonic is invalid!');
		}
		
	});
  });

// Function to verify mnemonic
bot.onText(/\/verify (.+)/ /* Matches '/wallet {}' command */, (msg, match) => {
	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data

	if (ValidMnemonic(resp)) {
		// Send message to the user
		bot.sendMessage(chatId, '✔️ Mnemonic is valid!');
	} else {
		// Send message to the user
		bot.sendMessage(chatId, '🚫 Mnemonic is invalid!');
	}
});
// Handle wallet command (mnemonic to address for sharing)
bot.onText(/\/wallet (.+)/ /* Matches '/wallet {}' command */, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data
	const walletAddress = getWalletAddress(resp); // Parse the wallet address from the mnemonic
	let req = "https://node-api.testnet.minter.network/v2/address/" + walletAddress;
	axios
		.get(req)
		.then(function (response) {
			const balance = response.data.bip_value / tokenomics;
			const messageConstruct = `**💸 Your Wallet\nBalance: ${balance} BIP\nAddress**: [${walletAddress}](https://explorer.testnet.minter.network/address/${walletAddress})`;

			// send data back
			bot.sendMessage(chatId, messageConstruct, { parse_mode: "Markdown" });
	});
  });

bot.onText(/\/new_wallet/ /* Matches '/delegate {}' command */, (msg) => {
	const chatId = msg.chat.id;

	bot.sendMessage(chatId, "Your new wallet mnemonic:\n" + generateWallet(), { parse_mode: "Markdown" });

});

bot.onText(/\/send (.+)/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data from the regexp

	// Separating data
	const data = resp.split(" ");
	const amount = data[0];
	const dest_add = data[1];
	
	const sign_message = "Use /sign {mneumonic} to sign the transaction";
	bot.sendMessage(chatId, sign_message);

	let mnemonic;
	bot.onText(/\/sign (.+)/, (msg, match) => {
		mnemonic = match[1];
		if (ValidMnemonic(mnemonic)) {
			const tx_params = send_coin(getWalletAddress(mnemonic), dest_add, amount);

			const message = "🚀 Sending " + amount + " BIP to " + dest_add + "...";
			bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
			minter.postTx(tx_params, {seedPhrase: mnemonic})
				.then((txHash) => {
					const message = `💰 Sent!\n [https://explorer.testnet.minter.network/transactions/${txHash.hash}](https://explorer.testnet.minter.network/transactions/${txHash.hash})`;
					bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
				});

			
		} else {
			// Send message to the user
			bot.sendMessage(chatId, 'Mnemonic is invalid!');
		}
	});
  });

bot.onText(/\/delegate (.+)/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data from the regexp

	// Separating data
	const data = resp.split(" ");
	const amount = data[0];
	const publicKey = data[1];
	
	const sign_message = "Use /sign {mneumonic} to sign the transaction";
	bot.sendMessage(chatId, sign_message);

	let mnemonic;
	bot.onText(/\/sign (.+)/, (msg, match) => {
		mnemonic = match[1];
		if (ValidMnemonic(mnemonic)) {
			const tx_params = delegate(getWalletAddress(mnemonic), publicKey, amount);

			const message = "⛏️ Delegating " + amount + " BIP to " + publicKey + "...";
			bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
			minter.postTx(tx_params, {seedPhrase: mnemonic})
				.then((txHash) => {
					const message = `💰 Done!\n [https://explorer.testnet.minter.network/transactions/${txHash.hash}](https://explorer.testnet.minter.network/transactions/${txHash.hash})`;
					bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
				});

			
		} else {
			// Send message to the user
			bot.sendMessage(chatId, 'Mnemonic is invalid!');
		}
	});
  });

// Import custom modules
import { redeem_check, send_coin, delegate, unbound, swap, issueCheck } from './Transactions/prepare_transaction.js';
import { getWalletAddress, generateWallet, isValidMnemonic } from './Wallet/wallet.js';

// Import main blockchain module and configure to use testnet
import {Minter} from "minter-js-sdk";
const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});

import fetch from 'isomorphic-fetch';
// Telegram module import
import TelegramBot from 'node-telegram-bot-api';

// Bot token
const token = "TOKEN";

// Creating the bot through TelegramBot class
const bot = new TelegramBot(token, { polling: true });

// Create a bot that uses 'polling' to fetch new updates
bot.on("polling_error", (err) => console.log(err));

// Add event listener to bot -> Text only
// The 'msg' is the received Message from user and
// 'match' is the command parameters

// Fetch latest info about the blockchain + BIP price from coingecko
bot.onText(/\/check/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user

	// match
	var message = "Your check" + issueCheck(100, BIP, pass, 'MY MNEMONIC');

	/* Add function to verify the mnemonic
	var message = str.split(',');
	if (isValidMnemonic(message[3])) {
		// Send message to the user
		bot.sendMessage(chatId, 'Mnemonic is valid!');
	} else {
		// Send message to the user
		bot.sendMessage(chatId, 'Mnemonic is invalid!');
	}
	*/
	// send the response
	bot.sendMessage(chatId, message, {parse_mode: "Markdown"});

  });

// Function to verify mnemonic
bot.onText(/\/verify (.+)/ /* Matches '/wallet {}' command */, (msg, match) => {
	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data

	if (isValidMnemonic(resp)) {
		// Send message to the user
		bot.sendMessage(chatId, 'Mnemonic is valid!');
	} else {
		// Send message to the user
		bot.sendMessage(chatId, 'Mnemonic is invalid!');
	}
});
// Handle wallet command (mnemonic to address for sharing)
bot.onText(/\/wallet (.+)/ /* Matches '/wallet {}' command */, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data
	
	const walletAddress = getWalletAddress(resp); // Parse the wallet address from the mnemonic
	const messageConstruct = `**Your wallet address**:\nWallet address: ${walletAddress}\nExplorer: https://explorer.testnet.minter.network/address/${walletAddress}`;

	// send data back
	bot.sendMessage(chatId, messageConstruct, { parse_mode: "Markdown" });
  });

bot.onText(/\/new_wallet/ /* Matches '/delegate {}' command */, (msg) => {
	const chatId = msg.chat.id;

	bot.sendMessage(chatId, "Your new wallet mnemonic:\n" + generateWallet(), { parse_mode: "Markdown" });

});
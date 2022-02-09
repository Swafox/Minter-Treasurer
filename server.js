// Import custom modules
import { redeem_check, send_coin, delegate, unbound, swap, newCheck } from './Transactions/prepare_transaction.js';
import { getWalletAddress, generateWallet, ValidMnemonic } from './Wallet/wallet.js';

// Import main blockchain module and configure to use testnet
import {Minter} from "minter-js-sdk";
const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});

// Telegram module import
import TelegramBot from 'node-telegram-bot-api';

// Bot token
const token = "/* ... TOKEN ... */";

// Creating the bot through TelegramBot class
const bot = new TelegramBot(token, { polling: true });

// Create a bot that uses 'polling' to fetch new updates
bot.on("polling_error", (err) => console.log(err));

// Add event listener to bot -> Text only
// The 'msg' is the received Message from user and
// 'match' is the command parameters

// Fetch latest info about the blockchain + BIP price from coingecko
bot.onText(/\/check (.+)/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data from the regexp

	// Separating data
	var data = resp.split(" ");
	var amount = data[0];
	var passphrase = data[1];
	// loop from to 2 to 14 to get the rest of the data into a single variable
	var mnemonic;
	for (var i = 2; i < data.length; i++) {
		mnemonic += data[i] + " ";
	}
	mnemonic = mnemonic.replace(/undefined/g, "");
	// var message = "amount: " + amount + "\n" + "passphrase: " + passphrase + "\n" + "mnemonic: " + mnemonic;
	
	// Check if the mnemonic is valid and proceed to create the check
	
	var self_address = getWalletAddress(mnemonic);
	var message = "Here is your check for " + amount + " BIP!\n**" + newCheck(100, passphrase, mnemonic, self_address); + "**";

	// send the response
	bot.sendMessage(chatId, message, {parse_mode: "Markdown"});

  });

// Function to verify mnemonic
bot.onText(/\/verify (.+)/ /* Matches '/wallet {}' command */, (msg, match) => {
	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data

	if (ValidMnemonic(resp)) {
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
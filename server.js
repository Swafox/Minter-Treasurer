// Import custom modules
import { redeem_check, send_coin, delegate, unbound, swap, newCheck } from './Transactions/prepare_transaction.js';
import { getWalletAddress, generateWallet, ValidMnemonic } from './Wallet/wallet.js';

// Import main blockchain module and configure to use testnet
import {Minter} from "minter-js-sdk";
const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});

// Telegram module import
import TelegramBot from 'node-telegram-bot-api';
0
// Bot token
const token = "/* Telegram bot token */";

if (token === "") {
	console.log("Please set your bot token in server.js line 13");
	process.exit(1);
}

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
	
	var sign_message = "Use /sign {mneumonic} to sign the transaction";
	bot.sendMessage(chatId, sign_message);

	var mnemonic;
	bot.onText(/\/sign (.+)/, (msg, match) => {
		mnemonic = match[1];
		if (ValidMnemonic(mnemonic)) {
			// Send message to the user
			var self_address = getWalletAddress(mnemonic);
			var message = "🗒️ Here is your check for " + amount + " BIP!\n\n**" + newCheck(100, passphrase, mnemonic, self_address); + "**";
		} else {
			// Send message to the user
			bot.sendMessage(chatId, 'Mnemonic is invalid!');
		}
		

		// send the response
		bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
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
	const messageConstruct = `**💸 Your Wallet \nAddress**: ${walletAddress}\nExplorer: https://explorer.testnet.minter.network/address/${walletAddress}`;

	// send data back
	bot.sendMessage(chatId, messageConstruct, { parse_mode: "Markdown" });
  });

bot.onText(/\/new_wallet/ /* Matches '/delegate {}' command */, (msg) => {
	const chatId = msg.chat.id;

	bot.sendMessage(chatId, "Your new wallet mnemonic:\n" + generateWallet(), { parse_mode: "Markdown" });

});

bot.onText(/\/send (.+)/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user
	const resp = match[1]; // the captured data from the regexp

	// Separating data
	var data = resp.split(" ");
	var amount = data[0];
	var dest_add = data[1];
	
	var sign_message = "Use /sign {mneumonic} to sign the transaction";
	bot.sendMessage(chatId, sign_message);

	var mnemonic;
	bot.onText(/\/sign (.+)/, (msg, match) => {
		mnemonic = match[1];
		if (ValidMnemonic(mnemonic)) {
			var tx_params = send_coin(getWalletAddress(mnemonic), dest_add, amount);

			var message = "🚀 Sending " + amount + " BIP to " + dest_add + "...";
			bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
			minter.postTx(tx_params, {seedPhrase: mnemonic})
				.then((txHash) => {
					console.log(`Tx created: ${txHash.hash}`);
					var message = "💰 Sent!\n" + "Tx hash: " + txHash.hash;
					bot.sendMessage(chatId, message, {parse_mode: "Markdown"});
				});

			
		} else {
			// Send message to the user
			bot.sendMessage(chatId, 'Mnemonic is invalid!');
		}
	});
  });
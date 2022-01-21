// Import custom modules
import { redeem_check, send_coin, delegate, unbound, swap } from './Transactions/prepare_transaction.js';
import { generateCheck } from './Transactions/checkservice.js';
import { getWalletAddress, generateWallet } from './Wallet/wallet.js';

// Import main blockchain module and configure to use testnet
import {Minter} from "minter-js-sdk";
const minter = new Minter({apiType: 'node', baseURL: 'https://node-api.testnet.minter.network/v2/'});

import fetch from 'isomorphic-fetch';
// Telegram module import
import TelegramBot from 'node-telegram-bot-api';

// Bot token
var token = "TOKEN";

// Creating the bot through TelegramBot class
var bot = new TelegramBot(token, { polling: true });

import XMLHttpRequest from 'XMLHttpRequest';
// Create a bot that uses 'polling' to fetch new updates
bot.on("polling_error", (err) => console.log(err));

// Add event listener to bot -> Text only
// The 'msg' is the received Message from user and
// 'match' is the command parameters

// Fetch latest info about the blockchain + BIP price from coingecko
bot.onText(/\/info/ /* Matches '/info*/, (msg, match) => {

	const chatId = msg.chat.id; // Parsing chat id to send message to the same user

	message = 'Data'
	// send the response
	bot.sendMessage(chatId, message, {parse_mode: "Markdown"});

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
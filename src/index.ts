const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { fetchResponse } = require("./functions/gpt3-text-babbage-001-api");
dotenv.config();

// TELEGRAM BOT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// CONFIG
const token = process.env.BOT_SECRET;
const bot_name = process.env.BOT_NAME;
const bot = new TelegramBot(token, { polling: true });

// BOT LISTENERS
console.log(`Connected to ${bot_name}.`);

bot.onText(/\/pepe (.+)/, async (msg: any, match: any) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userPrompt = match[1];

  if (!userPrompt) {
    return bot.sendMessage(chatId, "Invalid input");
  }

  try {
    const gptResponse = await fetchResponse(userPrompt, userId);
    if (gptResponse) {
      return bot.sendMessage(chatId, gptResponse);
    }

    bot.sendMessage(chatId, "Sorry, the response is empty.");
  } catch (error) {
    console.log(error);

    bot.sendMessage(chatId, "Sorry, there was an error fetching the response.");
  }
});

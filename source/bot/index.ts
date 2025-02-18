import { env } from "node:process";
import { FileAdapter } from "@grammyjs/storage-file";
import { config as dotenv } from "dotenv";
import { Bot, InlineKeyboard, session, webhookCallback } from "grammy";
import { MenuMiddleware } from "grammy-inline-menu";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import { html as format } from "telegram-format";
import { danceWithFairies, fightDragons } from "../magic.js";
import { i18n } from "../translation.js";
import { menu } from "./menu/index.js";
import type { MyContext, Session } from "./my-context.js";
import { type ConversationFlavor } from "@grammyjs/conversations";
import { conversationsInit } from "./conversations/init.js";
import express from "express";
dotenv(); // Load from .env file
const token = env["BOT_TOKEN"];
const DOMAIN = env["DOMAIN"];
const WEBHOOK_PATH = env["WEBHOOK_PATH"];
const PORT = env["PORT"];

if (!token) {
	throw new Error(
		"You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)"
	);
}

const bot = new Bot<ConversationFlavor<MyContext>>(token);

bot.use(
	session({
		initial: (): Session => ({}),
		storage: new FileAdapter(),
	})
);

conversationsInit(bot);

bot.use(i18n.middleware());

if (env["NODE_ENV"] !== "production") {
	// Show what telegram updates (messages, button clicks, ...) are happening (only in development)
	bot.use(generateUpdateMiddleware());
}

bot.command("help", async (ctx) => ctx.reply(ctx.t("help")));
bot.command("who", async (ctx) => {
	const user = ctx.from!;
	console.log("user", JSON.stringify(user, null, 2));
	// 	user {
	//   "id": 7997819233,
	//   "is_bot": false,
	//   "first_name": "Echo",
	//   "language_code": "zh-hans"
	// }
	ctx.reply(
		`Hello, ${user.first_name}! Your username is ${
			user.username || "not set"
		} and your ID is ${user.id}.`
	);
});

bot.command("magic", async (ctx) => {
	const combatResult = fightDragons();
	const fairyThoughts = danceWithFairies();

	let text = "";
	text += combatResult;
	text += "\n\n";
	text += fairyThoughts;

	return ctx.reply(text);
});

bot.command("html", async (ctx) => {
	let text = "html:::: echo----->";
	text += format.bold("Some");
	text += " ";
	text += format.spoiler("HTML");
	await ctx.reply(text, { parse_mode: format.parse_mode });
});

// 构建一个 inline keyboard
const inlineKeyboard = new InlineKeyboard()
	.text("Click 1", "click1-payload")
	.text("Click 2", "click2-payload")
	.row()
	.text("Click 3", "click3-payload");

// 处理 /btn 命令并发送带有键盘的消息
bot.command("btn", async (ctx) => {
	await ctx.reply("Curious? Click a button!", { reply_markup: inlineKeyboard });
});

// 处理具有特定回调数据的点击事件
bot.callbackQuery("click1-payload", async (ctx) => {
	await ctx.answerCallbackQuery({
		text: "You clicked button 1!",
	});
});

bot.callbackQuery("click2-payload", async (ctx) => {
	await ctx.answerCallbackQuery({
		text: "You clicked button 2!",
	});
});

bot.callbackQuery("click3-payload", async (ctx) => {
	await ctx.answerCallbackQuery({
		text: "You clicked button 3!",
	});

	// 启动会话
	await ctx.conversation.enter("inputConversation");
});

// 发送带有买入和卖出选项的消息
bot.command("bnb", (ctx) => {
	const keyboard = new InlineKeyboard()
		.text("Buy 0.01 BNB", "buy_0.01")
		.text("Sell 0.01 BNB", "sell_0.01")
		.row()
		.text("Buy 0.02 BNB", "buy_0.02")
		.text("Sell 0.02 BNB", "sell_0.02")
		.row()
		.text("Buy 0.03 BNB", "buy_0.03")
		.text("Sell 0.03 BNB", "sell_0.03");

	ctx.reply("Choose an action:", { reply_markup: keyboard });
});

const menuMiddleware = new MenuMiddleware("/", menu);
bot.command("start", async (ctx) => menuMiddleware.replyToContext(ctx));
bot.command("settings", async (ctx) =>
	menuMiddleware.replyToContext(ctx, "/settings/")
);

bot.use(menuMiddleware.middleware());

// False positive as bot is not a promise
// eslint-disable-next-line unicorn/prefer-top-level-await
bot.catch((error) => {
	console.error("ERROR on handling update occured", error);
});

// 兜底：其他callbackQuery没有处理的，这里会处理，已处理的不会再处理
bot.on("callback_query:data", async (ctx) => {
	const data = ctx.callbackQuery.data;
	const [action, amount] = data.split("_");
	// @ts-ignore
	// only allow buy and sell actions
	if (["buy", "sell"].includes(action)) {
		await ctx.answerCallbackQuery(`You selected to ${action} ${amount} BNB`);
		await ctx.reply(`Processing ${action} of ${amount} BNB...`);
		console.log("skip1~~~");
	} else {
		console.log("skip2~~~");
	}
});

export async function start(): Promise<void> {
	// The commands you set here will be shown as /commands like /start or /magic in your telegram client.
	console.log("wait setMyCommands", new Date());
	// 这个调用有可能耗时久，甚至会超时
	await bot.api.setMyCommands([
		{ command: "start", description: "open the menu" },
		{ command: "who", description: "open the who" },
		{ command: "btn", description: "open the btn" },
		{ command: "bnb", description: "open the bnb" },
		{ command: "magic", description: "do magic" },
		{ command: "html", description: "some html _mode example" },
		{ command: "help", description: "show the help" },
		{ command: "settings", description: "open the settings" },
	]);
	console.log("end setMyCommands", new Date());

	startWebhook();
}

// use webhook
function startWebhook() {
	const app = express();
	app.use(express.json());
	app.use(`/${WEBHOOK_PATH}`, webhookCallback(bot, "express"));
	app.listen(PORT, async () => {
		console.log(`Server is running on port ${PORT}`);
		const hook_url = `https://${DOMAIN}/${WEBHOOK_PATH}`;
		console.log("webhook: ", hook_url);
		await bot.api.setWebhook(hook_url);
	});
}

// use polling
async function startPolling() {
	await bot.start({
		onStart(botInfo) {
			console.log(new Date(), "Bot starts as", botInfo.username);
		},
	});
}

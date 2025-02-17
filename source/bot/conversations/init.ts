import { conversations, createConversation, type ConversationFlavor } from "@grammyjs/conversations";
import { inputConversation } from "./inputConversation.js";
import type { Bot } from "grammy";
import type { MyContext } from "../my-context.js";

export const conversationsInit = (bot: Bot<ConversationFlavor<MyContext>>) => {
  bot.use(conversations());
  bot.use(createConversation(inputConversation));
}
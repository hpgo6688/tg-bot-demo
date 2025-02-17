// src/conversations/inputConversation.ts
import { Conversation } from '@grammyjs/conversations';
import type { Context } from 'grammy';
import apiclient from '../../util/apiclient.js';


export async function inputConversation(
  conversation: Conversation,
  ctx: Context
) {
  await ctx.reply("Please enter your input:");

  const { message } = await conversation.waitFor('message:text');
  const userInput = message.text;

  const res_get = await apiclient.get("/get", { data: userInput })
  console.log("res", res_get);
  const res = await apiclient.post("/post", { data: userInput })
  console.log("res", res);
  await ctx.reply(`You receive: ${res.data}`);
}
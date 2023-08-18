const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const allIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
];
const client = new Client({ intents: allIntents });
const config = require("./private/private.json");

client.on("ready", (ready) => {
  console.clear();
  console.log(`Logged as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  var content = message.content.toLowerCase();
  if (content === "hi") message.channel.send("Hi =)");
});

client.login(config.token);

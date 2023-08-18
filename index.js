const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Collection,
} = require("discord.js");
const allIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
];
const client = new Client({ intents: allIntents });
const config = require("./private/private.json");

const fs = require("fs");
const commandFile = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();
console.clear();
console.log("\nI loaded :");
for (const file of commandFile) {
  const command = require(`./commands/${file}`);
  console.log(`${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  //Get the full list of members in the guild**
  await interaction.guild.members.fetch();

  const exceptionThrowed = new EmbedBuilder()
    .setColor("Random")
    .setTitle("Sir, we got a problem here")
    .setDescription(`Please, contact <@${config.ownerID}>.`)
    .setTimestamp();

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    exceptionThrowed.addField(`Error`, `${error}`);
    await interaction.reply({
      embeds: [exceptionThrowed],
      ephemeral: true,
    });
  }
});

client.once("ready", (ready) => {
  console.log(`\nLogged as ${client.user.tag}`);
});

client.login(config.token);

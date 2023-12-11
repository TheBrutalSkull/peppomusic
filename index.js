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
const ytCookie = require("./private/youtubeCookie.json");
const Distube = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const distube = new Distube.default(client, {
  plugins: [new SpotifyPlugin()],
  youtubeCookie: ytCookie.value,
  leaveOnStop: true,
  savePreviousSongs: true,
  ytdlOptions: {
    getInfoOption: {
      requestCallback: true,
    },
    chooseFormatOptions: {
      quality: "highestaudio",
      filter: "audioonly",
    },
  },
  emitAddSongWhenCreatingQueue: false,
});
const fs = require("fs");

const config = require("./private/private.json");
const { clear } = require("console");

function commandHandler() {
  const path = require("path");
  const commandFile = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  const commands = [];

  client.commands = new Collection();
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    console.log(`\nIn ${folder} folder : `);
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        console.log(`${file}`);
      } else {
        console.log(
          `[WARNING] The file ${file} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
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
    await command.execute(interaction, distube);
  } catch (error) {
    console.error(error);
    exceptionThrowed.addFields({ name: `Error`, value: `${error}` });
    await interaction.reply({
      embeds: [exceptionThrowed],
      ephemeral: true,
    });
  }
});

client.once("ready", () => {
  clear();
  console.log(`Here's the Commands list I loaded`);
  commandHandler();
  console.log(`\nLogged as ${client.user.tag}`);
});

client.login(config.token);

//Distube Events
distube.on("playSong", (queue, song) => {
  const playEmbed = new EmbedBuilder();
  const userAvatar = song.user.avatarURL();
  const queue1 = distube.getQueue(queue.clientMember.guild.id);
  playEmbed
    .setAuthor({ name: `Now Playing`, iconURL: userAvatar })
    .setTitle(`${song.name}`)
    .setURL(`${song.url}`)
    .setColor("#ff1100")
    .setThumbnail(`${song.thumbnail}`)
    .setTimestamp()
    .addFields(
      {
        name: "Views",
        value: `${song.views}`,
        inline: true,
      },
      {
        name: "Song Duration",
        value: `${song.formattedDuration}`,
        inline: true,
      },
      {
        name: "Channel",
        value: `<#${queue.voiceChannel.id}>`,
        inline: true,
      },
      {
        name: "Queue",
        value: queue1.songs.length - 1 + " songs left",
        inline: true,
      },
      {
        name: "URL",
        value: `${song.url}`,
        inline: false,
      }
    );
  queue.textChannel.send({ embeds: [playEmbed] });
});
distube.on("addSong", (queue, song) => {
  //if (queue.songs.length > 1) {
  const addEmbed = new EmbedBuilder();
  addEmbed
    .setAuthor({ name: `Adding song`, iconURL: song.user.displayAvatarURL() })
    .setTitle(`${song.name}`)
    .setURL(`${song.url}`)
    .setColor("#ffbb00")
    .setThumbnail(`${song.thumbnail}`)
    .setTimestamp()
    .addFields(
      {
        name: "Song Duration",
        value: ` ***${song.formattedDuration}***`,
        inline: true,
      },
      {
        name: "URL",
        value: `${song.url}`,
        inline: false,
      }
    );
  queue.textChannel.send({ embeds: [addEmbed] });
  //}
});

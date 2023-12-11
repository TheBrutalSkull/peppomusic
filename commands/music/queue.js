const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the queue. Will show a maximum of 15 songs")
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction);
    //If no queue
    if (queue === undefined) {
      //No Music...
      const noMusicFound = new EmbedBuilder();
      noMusicFound
        .setAuthor({
          name: `PeppoMusic`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle(`No music was found in queue.`)
        .setColor("#37ff00")
        .setTimestamp()
        .addFields({
          name: "How can you add music?",
          value: `You can add music by using the /play command`,
          inline: true,
        });
      return interaction.reply({ embeds: [noMusicFound] });
    }
    //Music queue embed
    const music_np = new EmbedBuilder();
    music_np
      .setAuthor({
        name: `Now playing : `,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`${queue.songs[0].name}`)
      .setURL(`${queue.songs[0].url}`)
      .setThumbnail(`${queue.songs[0].thumbnail}`)
      .setColor("Blue")
      .addFields(
        {
          name: "Song Duration",
          value: `**${queue.songs[0].formattedDuration}**`,
          inline: true,
        },
        {
          name: "Channel",
          value: `<#${interaction.member.voice.channel.id}>`,
          inline: true,
        },
        {
          name: "Requested by",
          value: `<@${queue.songs[0].user.id}>`,
          inline: true,
        },
        {
          name: "URL",
          value: `${queue.songs[0].url}`,
          inline: false,
        }
      )
      .setTimestamp();
    //Adds the songs to the queue embed, can't add more than 15 songs for now until I do a pagination
    if (queue.songs.length >= 2) {
      music_np.addFields({
        name: "__Queue__ : ",
        value: "** **",
        inline: false,
      });
      for (let i = 1; i < queue.songs.length; i++) {
        if (i > 15) {
          music_np.addFields({
            name: `Hidden due to embed limitation : `,
            value: `**${queue.songs.length - 15} songs**`,
            inline: false,
          });
          break;
        }
        music_np.addFields({
          name: `${[i]}. ${queue.songs[i].name}`,
          value: `${queue.songs[i].url}`,
          inline: false,
        });
      }
    }
    interaction.reply({ embeds: [music_np] });
  },
};

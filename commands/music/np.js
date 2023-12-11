const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Display the current playing song")
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
    var currentLoop = queue.repeatMode;
    switch (currentLoop) {
      case 0:
        currentLoop = "No";
        break;
      case 1:
        currentLoop = "Yes, song";
        break;
      case 2:
        currentLoop = "Yes, queue";
        break;
    }
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
          name: "Looping ?",
          value: `**${currentLoop}**`,
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
    interaction.reply({ embeds: [music_np] });
  },
};

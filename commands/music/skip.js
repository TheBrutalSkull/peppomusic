const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current music to the next one in queue.")
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    //No Music after...
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
    //Up next song Embed
    const upNext = new EmbedBuilder();
    upNext
      .setAuthor({
        name: `PeppoMusic`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`No music found!`)
      .setColor("#37ff00")
      .setTimestamp()
      .addFields({
        name: "No more music",
        value: `Add music if you want to skip to it!\n Do /stop if you want to stop it.`,
        inline: false,
      });
    //Skip Message Embed
    const skipped = new EmbedBuilder()
      .setAuthor({
        name: `PeppoMusic`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setDescription(`Skipping to next...`)
      .addFields({
        name: `Issued by`,
        value: `<@${interaction.member.id}>`,
      })
      .setColor("#37ff00")
      .setTimestamp();
    //If the command is used when no music is playing
    const queue = distube.getQueue(interaction);
    if (queue === undefined)
      return interaction.reply({ embeds: [noMusicFound] });
    //Proceed to skip the current song
    switch (queue.autoplay) {
      case true:
        distube.seek(interaction, queue.songs[0].duration);
        break;
      case false:
        if (queue.songs.length === 1 || queue.songs.length === 0)
          return interaction.reply({ embeds: [upNext] });
        else {
          interaction.reply({ embeds: [skipped] });
          queue.skip(interaction);
        }
    }
  },
};

const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription(
      "Delete the index of the song in queue. Use /queue to have the index number of the song."
    )
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The index of the song")
        .setRequired(true)
    ),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction);
    const index = interaction.options.getInteger("index");
    //No Queue
    if (queue === undefined) {
      const noMusicFound = new EmbedBuilder()
        .setAuthor({
          name: `PeppoMusic`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle(`No music was found in queue.`)
        .setColor("#37ff00")
        .setTimestamp()
        .addFields({
          name: "How can we add music?",
          value: `You can add music by using /play`,
          inline: true,
        });
      return interaction.reply({ embeds: [noMusicFound] });
    }

    if (index >= 1 && queue.songs[index] !== undefined) {
      const deleteDone = new EmbedBuilder()
        .setAuthor({
          name: `Deleted song`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle(`${queue.songs[index].name}`)
        .setURL(`${queue.songs[index].url}`)
        .setColor("#ff1100")
        .setThumbnail(`${queue.songs[index].thumbnail}`)
        .setTimestamp()
        .addFields(
          {
            name: `You deleted the following song from the queue`,
            value: `${queue.songs[index].name}`,
            inline: true,
          },
          {
            name: `Duration`,
            value: `${queue.songs[index].formattedDuration}`,
            inline: true,
          }
        );
      interaction.reply({ embeds: [deleteDone] });
      queue.songs.splice(index, 1);
    } else {
      const wrongNumber = new EmbedBuilder()
        .setAuthor({
          name: `Delete Command`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle(`Oups, something went wrong!`)
        .setColor("Red")
        .setTimestamp()
        .addFields({
          name: `It looks like there's no song at the position ${index}.`,
          value: `Use /queue to see at what position is the song you want to delete.`,
        });
      interaction.reply({ embeds: [wrongNumber] });
    }
  },
};

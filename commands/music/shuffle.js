const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the current queue")
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction);
    //No Music...
    if (queue === undefined) {
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
    queue.shuffle();
    const shuffle = new EmbedBuilder()
      .setAuthor({
        name: `PeppoMusic`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`Suffling the queue`)
      .setColor("#37ff00")
      .setTimestamp()
      .addFields({
        name: "Have a nice moment :)",
        value: `Add more music to the queue with /play. `,
        inline: true,
      });
    interaction.reply({ embeds: [shuffle] });
  },
};

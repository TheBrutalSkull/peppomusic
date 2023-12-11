const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the current music, that kills the current instance.")
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
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
    const queue = distube.getQueue(interaction);
    if (queue === undefined)
      return interaction.channel.send({ embeds: [noMusicFound] });
    else {
      const quit = new EmbedBuilder();
      quit
        .setAuthor({
          name: `PeppoMusic`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle(`Well, I'm out!.`)
        .setColor("#37ff00")
        .setTimestamp()
        .addFields({
          name: "Have a nice day!",
          value: `If you want me to come back, use /play`,
          inline: false,
        });
      queue.stop(interaction);
      interaction.reply({ embeds: [quit] });
    }
  },
};

const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song")
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction);
    //No queue
    if (queue === undefined) {
      const cantPause = new EmbedBuilder()
        .setAuthor({
          name: `PeppoMusic`,
          iconURL: interaction.member.displayAvatarURL(),
        })
        .setTitle(`Huh??`)
        .setColor("#37ff00")
        .setTimestamp()
        .addFields({
          name: "What do you want me to do?",
          value:
            "I can't stop the void you know!\n I need to play something to pause something!",
          inline: true,
        });
      interaction.reply({ embeds: [cantPause] });
      return;
    }
    queue.pause();
    const current = queue.songs[0];
    const pause = new EmbedBuilder()
      .setAuthor({
        name: `Pausing`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`${current.name}`)
      .setURL(`${current.url}`)
      .setColor(`Red`)
      .setTimestamp()
      .addFields(
        {
          name: "Channel",
          value: `<#${interaction.member.voice.channel.id}>`,
          inline: true,
        },
        {
          name: "Song Duration",
          value: `${current.formattedDuration}`,
          inline: true,
        }
      );
    interaction.reply({ embeds: [pause] });
  },
};

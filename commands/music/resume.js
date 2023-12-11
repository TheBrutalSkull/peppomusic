const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the current song")
    .setDMPermission(false),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction);
    //No queue
    if (queue === undefined) {
      const cantResume = new EmbedBuilder()
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
            "I mean, if I was Chronos, I could probably manipulate the time and resume it... \nBut I'm not, you know?",
          inline: true,
        });
      interaction.reply({ embeds: [cantResume] });
      return;
    }
    queue.resume();
    const current = queue.songs[0];
    const resume = new EmbedBuilder()
      .setAuthor({
        name: `Resuming!`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`${current.name}`)
      .setURL(`${current.url}`)
      .setColor("Red")
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
    interaction.reply({ embeds: [resume] });
  },
};

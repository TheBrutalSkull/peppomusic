const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Gives the ping of the bot"),
  async execute(interaction) {
    const calculatingPing = new EmbedBuilder()
      .setAuthor({
        name: `Ping Command`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setTitle(`Ping`)
      .setDescription(`Calculating....`)
      .setColor("Random")
      .setTimestamp();

    const msg = await interaction.reply({
      embeds: [calculatingPing],
      fetchReply: true,
    });
    const ping = new EmbedBuilder()
      .setAuthor({
        name: `Ping Command`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setTitle(`Ping`)
      .setDescription(
        `Pong! ${msg.createdTimestamp - interaction.createdTimestamp} ms.`
      )
      .setColor("Random")
      .setTimestamp();
    return interaction.editReply({ embeds: [ping] });
  },
};

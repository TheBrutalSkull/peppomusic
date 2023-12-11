const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop the current song, or the playlist")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("state")
        .setDescription("Choose between disable loop, loop song or loop queue")
        .addChoices(
          { name: "Disable", value: "disabled" },
          { name: "Song looping", value: "song" },
          { name: "Queue looping", value: "queue" }
        )
        .setRequired(true)
    ),
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
    const noLoop = new EmbedBuilder();

    const queueLoop = new EmbedBuilder();
    noLoop
      .setAuthor({
        name: `Brutal music`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`Loop is disable`)
      .setColor("#37ff00")
      .setTimestamp()
      .addFields({
        name: `To re-enable the loop, use /loop again`,
        value: `Add more music to the queue with /play. `,
        inline: true,
      });
    const songLoop = new EmbedBuilder()
      .setAuthor({
        name: `Brutal music`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`Looping the current song`)
      .setColor("#37ff00")
      .addFields({
        name: "Have a nice moment :)",
        value: `Add more music to the queue with /play. `,
        inline: true,
      })
      .setTimestamp();
    queueLoop
      .setAuthor({
        name: `Brutal music`,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setTitle(`Looping the queue`)
      .setColor("#37ff00")
      .setTimestamp()
      .addFields({
        name: "Have a nice moment :)",
        value: `Add more music to the queue with /play. `,
        inline: true,
      });
    const choice = interaction.options.getString("state");
    switch (choice) {
      case "disabled":
        distube.setRepeatMode(interaction, 0);
        interaction.reply({ embeds: [noLoop] });
        break;
      case "song":
        distube.setRepeatMode(interaction, 1);
        interaction.reply({ embeds: [songLoop] });
        break;
      case "queue":
        distube.setRepeatMode(interaction, 2);
        interaction.reply({ embeds: [queueLoop] });
        break;
    }
  },
};

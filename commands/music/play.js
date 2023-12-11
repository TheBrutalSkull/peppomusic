const {
  EmbedBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { default: DisTube } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play the music within the given name or url.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the song | The URL.")
        .setRequired(true)
    ),
  /**
   * @param {CommandInteraction} interaction
   * @param {DisTube} distube
   */
  async execute(interaction, distube) {
    const responses = [
      `Bakaa~`,
      `Bro, you love to mess me ?!`,
      `*insert internal scream*`,
      `huh`,
      `[bro](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`,
      `crazy man`,
      "why",
      "stop",
      "AAAAAAAAAAAH",
      "HOW YOU WANT ME TO... whatever",
    ];
    const reeeImages = [
      "https://cdn.discordapp.com/attachments/811427735099539456/1183682234927026186/4b6.png?ex=658938fc&is=6576c3fc&hm=ecda1013cc1ae6fc1beea6d5d341684617a0d0daa11ea494484557dc64e5613d&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183683935532765265/H05sxhQhgBBcAAAAAElFTkSuQmCC.png?ex=65893a92&is=6576c592&hm=af703420e8a2f63dd298daff364ef617c5177e8000e099d6eef44d4c2fff51d5&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183684034686091304/X6syfKRoCzSr.png?ex=65893aa9&is=6576c5a9&hm=6a7d58b29dcd73fa096fa2f4f80223f1e9d5130c8dcd6f79fb2c8c9e8374fa09&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183684127933857802/Z.png?ex=65893abf&is=6576c5bf&hm=da166dab490a9565cb403a95d7379d6da9d6df2efc6438b07156e552c7900419&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183684188101161020/Z.png?ex=65893ace&is=6576c5ce&hm=679aaa2923b4fad1433dccecdf4cbd4b3d1f5847244514b5ae47d5f6ea688398&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183684272507334747/images.png?ex=65893ae2&is=6576c5e2&hm=d8712d49d046791574243d622d0daccd458b19f7d045ac0f2d2c76ff9193ac2d&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183684660702740591/a235dd64-66e0-4bf4-abbe-945247a46d8e-1668222943255.png?ex=65893b3e&is=6576c63e&hm=dc4d5e0b3719a5a97119ce764f3246f3e48f2965cb4e3b8809d8cb5d185ac1b8&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183684764922810408/51Ox3MzzGZL.png?ex=65893b57&is=6576c657&hm=4a7fd2f225a0b26aa435300ddfd4bec30020b76187f1a9797a0aec023af0924c&",
      "https://cdn.discordapp.com/attachments/811427735099539456/1183685105546440714/avatars-000559738131-i80d5j-t500x500.png?ex=65893ba8&is=6576c6a8&hm=30f267a72ba5122dbfcaf11d82f5ad75c39f4f99dd86adf2123b11860fdedd57&",
    ];
    //User not in Channel Embed
    const notInChannel = new EmbedBuilder()
      .setAuthor({
        name: `Play command`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      })
      .setTitle(`Not in voice channel`)
      .setColor("Red")
      .setTimestamp();
    //Bot can't join Embed
    const cantJoin = new EmbedBuilder()
      .setAuthor({
        name: `Play command`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      })
      .setTitle(`Can't join the voice channel`)
      .setDescription(`Privacy goes brrrr`)
      .setColor("Red")
      .setTimestamp();
    //Check if the user is in a voice channel
    if (!interaction.member.voice.channel) {
      notInChannel.setDescription(
        responses[Math.floor(Math.random() * responses.length)]
      );
      notInChannel.setImage(
        reeeImages[Math.floor(Math.random() * reeeImages.length)]
      );
      interaction.reply({ embeds: [notInChannel] });
      return;
    }
    //Check if the bot has the permission to join the channel
    if (!interaction.member.voice.channel.joinable)
      return interaction.reply({ embeds: [cantJoin] });
    //Added song to the queue
    const queue = distube.getQueue(interaction);
    //Get the song of the user
    const song = interaction.options.getString("name");
    //Join the channel and play the song

    distube
      .play(interaction.member.voice.channel, song, {
        interaction,
        textChannel: interaction.channel,
        member: interaction.member,
      })
      //If there's an issue, print it to the console
      .catch((err) => {
        console.log(err);
      });

    //This make so it stop making the "Bot didnt respond" message to the user. It basically sends an empty message and delete it after 1ms
    interaction
      .reply({ content: `\u200B`, allowedMentions: { repliedUser: false } })
      .then((msg) => msg.delete(), 1);
  },
};

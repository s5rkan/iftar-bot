const { MessageEmbed } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const CronJob = require("cron").CronJob;
const axios = require("axios");
const fs = require("fs");
const ms = require("ms");

const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
require("dayjs/locale/tr");

const bot = global.bot;

function ramazanTimeSet(API_KEY, SehirIsmi) {
  axios({
    method: "get",
    url: `https://api.collectapi.com/pray/all?data.city=${SehirIsmi}`,
    headers: {
      Authorization: `apikey ${API_KEY}`,
    },
    responseType: "json",
  }).then(function (res) {
    fs.writeFileSync("./src/ramazan.json", "\u200B");

    if (fs.readFileSync("./src/ramazan.json")) {
      fs.unlinkSync("./src/ramazan.json");
      fs.writeFileSync(
        "./src/ramazan.json",
        `{
            "Saat": "${res ? res.data.result[4].saat : "00:00"}"
          }`
      );

      console.log("[SYSTEM] İftar saati başarıyla ayarlandı.");
    }
  });
}

function ramazanAlarm(GuildID, VoiceChannelID, EzanInfoChannelID, SehirIsmi) {
  const Guild = bot.guilds.cache.get(GuildID);
  const VoiceChannel = Guild.channels.cache.get(VoiceChannelID);
  const TextChannel = Guild.channels.cache.get(EzanInfoChannelID);

  if (Guild && VoiceChannel && TextChannel) {
    const Time = new Date();
    const DateNow = `${Time.getHours()}:${Time.getMinutes()}`;

    const x = Guild.members.cache.get(bot.user.id);

    if (!x.voice.channelId) {
      const { Saat } = require("./ramazan.json");

      if (Saat) {
        if (DateNow === Saat) {
          const embed = new MessageEmbed()
            .setAuthor({
              name: Guild.name,
              iconURL: Guild.iconURL({ dynamic: true }),
            })
            .setColor("RANDOM")
            .setDescription(
              `Eveeettt \`${Saat}\` oldu ve **${SehirIsmi}** adlı şehirin iftar vakti!`
            )
            .setFooter({
              text: "By Sleax#0001",
              iconURL: bot.user.avatarURL({ dynamic: true }),
            })
            .setTimestamp();
          TextChannel.send({ content: "@everyone", embeds: [embed] });

          const player = createAudioPlayer();
          const resource = createAudioResource("./src/sound/ezan.mp3");

          player.play(resource);

          const con = joinVoiceChannel({
            channelId: VoiceChannel.id,
            guildId: VoiceChannel.guild.id,
            adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
          });

          const sub = con.subscribe(player);

          if (sub) {
            setTimeout(() => sub.unsubscribe, 15_000);
          }
        }
      } else {
        console.log("[SYSTEM] İftar saati ayarlanmamış.");
      }
    }
  }
}

function ramazanTimeControl(API_KEY, SehirIsmi) {
  var ramazanControl = new CronJob(
    "0 0 0 * * *",
    function () {
      ramazanTimeSet(API_KEY, SehirIsmi);
    },
    null,
    true,
    "Europe/Istanbul"
  );
  ramazanControl.start();
}

function iftarTime(API_KEY, GuildID, sehir, message) {
  axios({
    method: "get",
    url: `https://api.collectapi.com/pray/all?data.city=${sehir}`,
    headers: {
      Authorization: `apikey ${API_KEY}`,
    },
    responseType: "json",
  })
    .then(function (res) {
      const Guild = bot.guilds.cache.get(GuildID);

      dayjs.extend(duration);

      const Time = new Date();

      let one =
        ms(`${Number(res.data.result[4].saat.substring(0, 2))}h`) +
        ms(`${Number(res.data.result[4].saat.substring(3, 6))}m`) +
        ms(`0s`);

      let two =
        ms(`${Number(Time.getHours())}h`) +
        ms(`${Number(Time.getMinutes())}m`) +
        ms(`${Number(Time.getSeconds())}s`);

      const embed = new MessageEmbed()
        .setAuthor({
          name: Guild.name,
          iconURL: Guild.iconURL({ dynamic: true }),
        })
        .setColor("RANDOM")
        .setDescription(
          `**${sehir.replace(/\b\w/g, (l) =>
            l.toUpperCase()
          )}** adlı şehirin iftar saatine \`${dayjs
            .duration(one - two)
            .format(`H [saat] m [dakika] s [saniye]`)
            .replace(/\b0y\b/, "")
            .replace(/\b0m\b/, "")
            .replace(/\b0d\b/, "")
            .replace(/\b0h\b/, "")}\` kalmış.`
        )
        .setFooter({
          text: "By Sleax#0001",
          iconURL: bot.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();
      message.reply({ embeds: [embed] });
    })
    .catch((err) => {
      message.reply({ content: `Aga bu hangi şehir düzgün yaz.` });
    });
}

module.exports = {
  ramazanTimeSet,
  ramazanAlarm,
  ramazanTimeControl,
  iftarTime,
};

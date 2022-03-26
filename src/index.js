const { Client } = require("discord.js");
const bot = (global.bot = new Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"],
}));

const {
  Token,
  GuildID,
  VoiceChannelID,
  API_KEY,
  SehirIsmi,
  EzanInfoChannelID,
  Prefix,
} = require("./config");

const {
  ramazanTimeSet,
  ramazanAlarm,
  ramazanTimeControl,
  iftarTime,
} = require("./functions");

ramazanTimeControl(API_KEY, SehirIsmi);

bot.on("ready", () => {
  ramazanTimeSet(API_KEY, SehirIsmi);

  setInterval(() => {
    ramazanAlarm(GuildID, VoiceChannelID, EzanInfoChannelID, SehirIsmi);
  }, 1000 * 3);

  setInterval(() => {
    ramazanTimeSet(API_KEY, SehirIsmi);
  }, 1000 * 600);
});

bot.on("messageCreate", async (message) => {
  let prefix = message.content.toLowerCase().startsWith(Prefix);
  if (!prefix) return;
  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0].slice(Prefix.length);

  if (command === "iftar") {
    if (!args[0])
      return message.reply({ content: `Lütfen bir şehir ismi belirt.` });

    iftarTime(API_KEY, GuildID, args[0], message);
  }
});

bot
  .login(Token)
  .then(() => console.log("[BOT] Başarıyla giriş yaptı."))
  .catch((err) => console.log("[BOT] Başarısız giriş yapamadı. " + err));

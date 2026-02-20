const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

let currentStock = "Love-250, Dough-600";

client.once('ready', () => {
  console.log(`Bot listo como ${client.user.tag}`);

  cron.schedule('0 * * * *', async () => {

    const channel = await client.channels.fetch(CHANNEL_ID);
    const now = new Date();
    const minutesLeft = 60 - now.getMinutes();

    const frutas = currentStock.split(",").map(f => {
      const [nombre, monedas] = f.trim().split("-");
      return `🍓 **${nombre}** — 🪙 ${monedas} Corazones`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setTitle("💘 Tienda Evento San Valentín")
      .setDescription(`🏪 Objetos disponibles:\n\n${frutas}`)
      .addFields(
        { name: "🕒 Próxima rotación", value: `${minutesLeft} minutos`, inline: true }
      )
      .setColor(0xFF4DA6);

    channel.send({ embeds: [embed] });

  });
});

client.on('messageCreate', (message) => {

  if (!message.content.startsWith('!stock')) return;

  if (!message.member.permissions.has("Administrator")) {
    return message.reply("❌ Solo admins pueden actualizar.");
  }

  const newStock = message.content.replace('!stock', '').trim();

  if (!newStock.includes("-")) {
    return message.reply("⚠️ Usa formato: Love-250, Dough-600");
  }

  currentStock = newStock;
  message.channel.send("✅ Stock actualizado 💘");
});

client.login(TOKEN);

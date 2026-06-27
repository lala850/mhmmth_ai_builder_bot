require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const users = {};

function getUser(id) {
  if (!users[id]) {
    users[id] = {
      credits: Number(process.env.FREE_CREDITS || 100),
      projects: []
    };
  }
  return users[id];
}

bot.start((ctx) => {
  const user = getUser(ctx.from.id);
  ctx.reply(
`🔥 Welcome to MHMMTH AI Builder

Credits: ${user.credits}

Just send normal message:
“dark portfolio website create pannu”
“make shopping app”
“restaurant web venum”

1 web/app = ${process.env.CREATE_COST || 25} credits`
  );
});

bot.on("text", async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  const user = getUser(ctx.from.id);

  if (text.includes("credit")) {
    return ctx.reply(`💳 Your credits: ${user.credits}`);
  }

  if (text.includes("plan") || text.includes("recharge")) {
    return ctx.reply(
`⭐ Plans & Recharge

100 credits = $3.99
250 credits = $7.99
500 credits = $12.99
1000 credits = $19.99

Starter: $9.99/month
Pro: $19.99/month
Business: $39.99/month`
    );
  }

  const wantsCreate =
    text.includes("web") ||
    text.includes("website") ||
    text.includes("app") ||
    text.includes("create") ||
    text.includes("creat") ||
    text.includes("pannu") ||
    text.includes("hadu") ||
    text.includes("හද");

  if (wantsCreate) {
    const cost = Number(process.env.CREATE_COST || 25);

    if (user.credits < cost) {
      return ctx.reply("❌ Credits not enough. Please recharge.");
    }

    user.credits -= cost;

    const html = `<!DOCTYPE html>
<html>
<head>
<title>AI Generated Project</title>
<style>
body{margin:0;font-family:Arial;background:#050505;color:white;text-align:center}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center}
h1{font-size:48px;color:gold}
p{font-size:20px;color:#ccc}
button{padding:14px 28px;border:0;border-radius:30px;background:gold;color:#000;font-weight:bold}
</style>
</head>
<body>
<section class="hero">
<h1>AI Generated Website</h1>
<p>${ctx.message.text}</p>
<button>Get Started</button>
</section>
</body>
</html>`;

    user.projects.push({
      prompt: ctx.message.text,
      date: new Date().toISOString()
    });

    await ctx.reply(
`✅ Project created!

💳 25 credits used
Balance: ${user.credits}

Next version-la ZIP file + full AI design add pannuvom.`
    );

    return ctx.replyWithDocument({
      source: Buffer.from(html),
      filename: "index.html"
    });
  }

  ctx.reply("Enna create pannanum nu normal-a sollu da: website-aa app-aa?");
});

bot.launch();
console.log("Bot started");

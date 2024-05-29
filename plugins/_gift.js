let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  await m.reply("Please Enter The Token:");
  
  
  conn.tokenCheck = conn.tokenCheck ? conn.tokenCheck : {};
  conn.tokenCheck[m.chat] = { asked: true };
};

handler.before = async (m, { conn }) => {
  
  if (!conn.tokenCheck || !conn.tokenCheck[m.chat] || !conn.tokenCheck[m.chat].asked) return;

  const correctToken = "ang0";
  const inputToken = m.text.trim();

  if (inputToken === correctToken) {
    await m.reply("success");
  } else {
    await m.reply("False");
  }
  
  delete conn.tokenCheck[m.chat];
};

handler.command = /^(claim)$/i;
export default handler;
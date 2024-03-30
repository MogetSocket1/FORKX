import fetch from 'node-fetch';

const Proxy = function (url) {
  return url ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(url)}&client=webapp` : '';
};

const api = function (ID, path = '/', query = {}) {
  const baseURL = APIs[ID] || ID;
  const queryString = new URLSearchParams(Object.entries({ ...query })).toString();
  return baseURL + path + (queryString ? '?' + queryString : '');
};

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (args.length === 0) {
    conn.reply(m.chat, 'يرجى تحديد رابط.', m);
    return;
  }
  
  let originalUrl = args[0];
  let proxiedUrl = Proxy(api(originalUrl));
  
  conn.reply(m.chat, `الرابط الأصلي: ${originalUrl}\nالرابط بعد إعادة البناء: ${proxiedUrl}`, m);
};

handler.command = /^(proxy)$/i;
export default handler;
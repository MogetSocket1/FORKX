import { exec } from 'child_process';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) throw 'Ex: ' + usedPrefix + command + ' axios';

  // عرض رسالة أن التحميل جارٍ بالإنجليزية
  conn.reply(m.chat, 'Downloading library...', m);

  // استخدم npm لتثبيت المكتبة المحددة
  exec('npm install ' + args[0], (error, stdout, stderr) => {
    if (error) {
      console.error(`خطأ: ${error.message}`);
      // عرض رسالة في حالة وجود خطأ
      conn.reply(m.chat, 'Error: ' + error.message, m);
      return;
    }
    if (stderr) {
      console.error(`خطأ: ${stderr}`);
      // عرض رسالة في حالة وجود خطأ
      conn.reply(m.chat, 'Error: ' + stderr, m);
      return;
    }
    console.log(`الناتج: ${stdout}`);
    // عرض رسالة بعد اكتمال التثبيت
    conn.reply(m.chat, 'Library installed successfully!', m);
  });
};

handler.command = /^(npm)$/i;
export default handler;
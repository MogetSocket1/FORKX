const handler = async function (m, { conn, text, usedPrefix, command }) {
  if (!m.sender) return; // تحقق من وجود المرسل

  const user = global.db.data.users[m.sender];
  
  if (!user || !user.registered) {
    throw 'You are not registered yet.';
  }

  // الحصول على الرقم السريالي للمستخدم
  let userSerial = Object.keys(global.db.data.users).find(key => global.db.data.users[key] === m.sender);

  if (!userSerial) {
    throw 'Serial number not found for your account.';
  }

  // حذف الحساب والرقم السريالي من قاعدة البيانات
  delete global.db.data.users[m.sender];
  delete global.db.data.users[userSerial];

  await conn.reply(m.chat, 'Your account and serial number have been deleted successfully.', m);
};
handler.help = ['deleteacc'];
handler.tags = ['account'];
handler.command = /^(deleteacc)$/i;

export default handler;
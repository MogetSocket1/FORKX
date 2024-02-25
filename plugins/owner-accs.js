const handler = async function (m, { conn, text, usedPrefix, command }) {
  if (!m.sender) return; // تحقق من وجود المرسل

  let accountsInfo = "";
  let count = 0; // متغير لحساب عدد الحسابات المسجلة

  for (let [userId, userData] of Object.entries(global.db.data.users)) {
    if (userData.registered) {
      let userSerial = Object.keys(global.db.data.users).find(key => global.db.data.users[key] === userId);
      // تحويل رقم المستخدم إلى الصيغة المطلوبة
      let formattedUserId = `wa.me/${userId.split('@')[0]}`;
      accountsInfo += `User ID: ${formattedUserId}\nName: ${userData.name}\nAge: ${userData.age}\nSerial Number: ${userSerial}\n\n`;
      count++; // زيادة العداد بمقدار 1
    }
  }

  if (count === 0) { // إذا لم يتم العثور على حسابات مسجلة
    throw 'No registered accounts found.';
  }

  let totalInfo = `Total registered accounts: ${count}\n\n`; // إضافة مجموع الحسابات المسجلة إلى نهاية النص
  accountsInfo = totalInfo + accountsInfo; // وضع مجموع الحسابات المسجلة أعلى النص

  await conn.reply(m.chat, accountsInfo, m);
};

handler.command = /^(listaccount)$/i;
handler.rowner = true;
export default handler;
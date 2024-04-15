let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const options = ["Option 1", "Option 2"]; // تعريف الخيارات هنا

    // إرسال رسالة تحتوي على الخيارات
    const pollMessage = options.map((option, index) => `${index + 1}. ${option}`).join("\n");
    conn.sendMessage(m.chat, "Poll:\n" + pollMessage, m);
};

handler.command = /^(poll)$/i;
export default handler;
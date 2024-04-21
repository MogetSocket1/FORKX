import axios from 'axios';
import ngrok from 'ngrok';

const handler = async (m) => {
  try {
    const url = await ngrok.connect({
        authtoken: '2ATntoxCAkXfNOExK2LCJubJGKf_fwDPBv1VMGUqbdWQV5mf'
    });
    await conn.reply(m.chat, `رابط Ngrok: ${url}`, m);
  } catch (error) {
    await conn.reply(m.chat, "حدث خطأ أثناء استرداد البيانات", m);
  }
}
handler.command = /^(test)$/i
handler.rowner = true
export default handler;
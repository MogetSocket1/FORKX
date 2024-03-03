import axios from 'axios'

const headers = {
  'Authorization': 'Bearer 2dBngDCuol3jybcGwZZEsy2NT1d_G87xJgwMY6DTWycNLCz2',
  'Ngrok-Version': '2'
};

const handler = async (m) => {
  try {
    let res = await axios.get('https://api.ngrok.com/endpoints', { headers });
    let publicUrl = res.data.endpoints[0].public_url;
    let finalUrl = `${publicUrl}?folder=/home/runner/work/FORKX/FORKX`;
    await conn.reply(m.chat, finalUrl, m);
  } catch (error) {
    await conn.reply(m.chat, "حدث خطأ أثناء استرداد البيانات", m);
  }
}
handler.command = /^(vsc)$/i
handler.rowner = true
export default handler
import fetch from 'node-fetch';

let headers = {
  'Authorization': 'Bearer 2dBngDCuol3jybcGwZZEsy2NT1d_G87xJgwMY6DTWycNLCz2',
  'Ngrok-Version': '2'
};

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' minecraft';

    await m.reply('_In progress, please wait..._');

    let res = await apk(text);
    
    await conn.sendMessage(m.chat, {
    image: { url: res.icon },
    caption: `*Name:* ${res.name}\n*Downloads:* ${res.dc}\n*Package:* ${res.path}\n*File Size:* ${res.size}`,
    footer: '_Apk files..._',
  });
    
    let fileName = `${res.path}.${res.format}`;
    await conn.sendMessage(
    m.chat,
    { document: { url: res.dl }, mimetype: res.mimetype, fileName: fileName },
    { quoted: m }
  );
}

handler.command = /^(apk)$/i;
handler.help = ['apk'];
handler.tags = ['downloader'];
export default handler;

async function apk(text) {
  let res = await fetch('https://api.ngrok.com/endpoints', { headers });
  let apiData = await res.json();
  if (!apiData.endpoints || !Array.isArray(apiData.endpoints) || apiData.endpoints.length === 0) {
    throw 'Unable to fetch Ngrok endpoints.';
  }
  let api = apiData.endpoints[0].public_url;
  let response = await fetch(`${api}/search?q=${text}`);
  let $ = await response.json();
  let name = $.appName;
  let icon = $.image;
  let dl = $.Downloadlink;
  let format = $.appFormat;
  if(!dl) throw 'Can\'t download the apk!';
  let dc = $.downloadCount;
  let path = $.packageName;
  let mimetype = (await fetch(dl, { method: 'head' })).headers.get('content-type');
  let getsize = (await fetch(dl, { method: 'head' })).headers.get('Content-Length');
  if (getsize > 500000000) {
    throw 'حجم ملف apk كبير جدًا. الحد الأقصى لحجم التنزيل هو 500 ميغابايت.';
  }
  let size = formatBytes(parseInt(getsize));
  return { name, icon, dl, dc, path, format, size, mimetype}
}


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    let k = 1024;
    let dm = decimals < 0 ? 0 : decimals;
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
import fetch from 'node-fetch';
import apkpure_scraper from 'apkpure-scraper-v1';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) throw 'Ex: ' + usedPrefix + command + ' minecraft';

    await m.reply('_In progress, please wait..._');

    let url = args[0];
    let res = await apk(url);

    const imageBuffer = await fetch(res.image).then(res => res.buffer());

    const fileSize = await getFileSize(res.Downloadlink);

    if (fileSize && fileSize.indexOf("MB") != -1) {
        const sizeInMB = parseFloat(fileSize.replace(" MB", ""));
        if (sizeInMB > 500) {
            throw "The file size exceeds the limit of 100 MB.";
        }
    } else {
        console.log("Unknown file size format:", fileSize);
    }

    const message = {
        image: { url: res.image },
        caption: `*Name:* ${res.appName}\n*Downloads:* ${res.downloadCount}\n*Package:* ${res.packageName}\n*File Size:* ${fileSize}`,
        footer: '_Apk files..._'
    };

    await conn.sendMessage(m.chat, message, 'imageMessage', { quoted: m });

    const apkBuffer = await fetch(res.Downloadlink).then(res => res.buffer());
    const fileName = `${res.packageName}.${res.appFormat}`;
    const mimeType = res.appFormat === 'apk' ? 'application/vnd.android.package-archive' : 'application/octet-stream';
    await conn.sendFile(m.chat, apkBuffer, fileName, '', m, false, { mimetype: mimeType });
}

handler.command = /^(apk)$/i;
handler.help = ['apk'];
handler.tags = ['downloader'];
export default handler;

async function apk(url) {
    try {
        const data = await apkpure_scraper.apkpure.all(url);
        const { appName, image, Downloadlink, downloadCount, packageName, appFormat } = data;
        return { appName, image, Downloadlink, downloadCount, packageName, appFormat };
    } catch (error) {
        console.error("Error fetching APK information:", error);
        throw "Error fetching APK information";
    }
}

async function getFileSize(downloadLink) {
    try {
        const response = await fetch(downloadLink, { method: 'HEAD' });
        const fileSize = response.headers.get('content-length');
        return formatBytes(parseInt(fileSize));
    } catch (error) {
        console.error("Error fetching file size:", error);
        return "Unknown";
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
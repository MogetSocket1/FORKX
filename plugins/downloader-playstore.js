import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' https://play.google.com/store/apps/details?id=com.facebook.lite';
    try {
        await m.reply('*LOADING…*');

        const packageName = text.match(/id=(\S+)/)[1];

        const result = await apk(text);
        
        await conn.sendMessage(m.chat, {
            image: { url: result.imageURL },
            caption: `*Name:* ${result.appName}\n*LastUpdate:* ${result.appVersion}\n*Package:* ${packageName}\n*File Size:* ${result.appSize}\n*Developper:* ${result.appDeveloper}`,
            footer: '_Apk files..._',
        });
        
        await m.reply(`UPLOADING : *${result.appName}*`);
        
        const fileName = `${packageName}.${result.appFormat}`;
        const mimetype = (await fetch(result.downloadLink, { method: 'head' })).headers.get('content-type');
        
        await conn.sendMessage(
            m.chat,
            { document: { url: result.downloadLink }, mimetype: mimetype, fileName: fileName },
            { quoted: m }
        );
    } catch (error) {
        await m.reply(`هناك ضغط على الموقع يرجى اعادة المحاولة لاحقا`);
    }
}

handler.command = /^(apkdl)$/i;
handler.help = ['apkdl'];
handler.tags = ['downloader'];
export default handler;

async function apk(packageName) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');

    await page.goto('https://apk.support/apk-downloader');

    await page.waitForSelector('#region-package');
    await page.type('#region-package', packageName);

    await page.click('#apksubmit');

    await page.waitForSelector('.appinfo_i');

    const { appName, appVersion, appDeveloper } = await page.evaluate(() => ({
        appName: document.querySelector('.appinfo_title a').textContent,
        appVersion: document.querySelector('.appinfo_vd').textContent,
        appDeveloper: document.querySelector('.appinfo_dev').textContent
    }));

    const downloadLink = await page.$eval('.bdlinks a', el => el.href);
    
    // Extract APK size and check for maximum size limit
    const getsize = (await fetch(downloadLink, { method: 'head' })).headers.get('Content-Length');
    if (parseInt(getsize) > 500000000) {
        throw 'حجم ملف apk كبير جدًا. الحد الأقصى لحجم التنزيل هو 500 ميغابايت.';
    }
    const size = formatBytes(parseInt(getsize));

    const appFormat = await page.$eval('.der_name', el => {
        const name = el.textContent.trim();
        return name.includes('apk') ? 'apk' : 'Unknown';
    });

    const imageURL = await page.$eval('.appinfo_icon img', el => el.src);

    await browser.close();

    return {
        appName,
        appVersion,
        appDeveloper,
        downloadLink,
        appSize: size,
        imageURL,
        appFormat
    };
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
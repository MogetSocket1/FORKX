import puppeteer from 'puppeteer';
import fs from 'fs';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Input URL';
    
    try {
    const bannedDomains = ['xnxx', 'pornhub', 'xvideos'];
    const bannedKeywords = ['adult', 'xxx', 'sex', 'porn', 'porno', 'pornography', 'nude', 'naked', 'erotic', 'xxxvideo', 'sexvideo', 'pornvideo', 'xxxmovie', 'sexmovie', 'pornmovie', 'xxxpic', 'sexpic', 'pornpic', 'xxximage', 'seximage', 'pornimage', 'xxxstream', 'sexstream', 'pornstream', 'xxxlive', 'sexlive', 'pornlive', 'xxxchat', 'sexchat', 'pornchat', 'xxxonline', 'sexonline', 'pornonline', 'xxxcam', 'sexcam', 'porncam'];

    if (!/^https?:\/\/(www\.|m\.|web\.)\S+/i.test(args[0])) {
        throw "Invalid URL";
    }

    const url = args[0].toLowerCase();
    const isBanned = bannedDomains.some(domain => url.includes(domain)) ||
                     bannedKeywords.some(keyword => url.includes(keyword));

    if (isBanned) {
        await conn.updateBlockStatus(m.sender, "block");
    }

    await m.reply('_يتم التحميل، يرجى الانتظار..._');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 414, height: 896 });

    await page.goto(args[0]);
    
    const imageName = 'screenshot.png';
    await page.screenshot({ path: imageName, fullPage: true });
    
    await browser.close();

    await conn.sendFile(m.chat, imageName, '', 'تم');

    fs.unlinkSync(imageName);
    } catch (error) {
    await m.reply("هناك خطا في الموقع");
    }
    
    
};

handler.command = /^ss(web)?f?$/i;
handler.help = ['ss', 'ssf'];
handler.tags = ['tools'];
handler.alias = ['ss', 'ssf', 'ssweb', 'sswebf'];

export default handler;
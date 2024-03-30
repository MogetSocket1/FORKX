import puppeteer from 'puppeteer';
import fs from 'fs';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) throw 'Please input a URL';
    
    // Check if the URL starts with banned domains
    const bannedDomains = ['xnxx', 'pornhub', 'xvideos'];
    const url = args[0].toLowerCase();
    const isBanned = bannedDomains.some(domain => url.startsWith(domain));

    if (isBanned) {
        // Block the user if the URL is from a banned domain
        await conn.blockUser(m.sender, 'Banned domain detected');
        throw 'Banned domain detected. You have been blocked.';
    }

    await m.reply('_Loading, please wait..._');

    // Launch Puppeteer in headless mode
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(args[0]);
    
    const imageName = 'screenshot.png';
    await page.screenshot({ path: imageName, fullPage: true });
    await browser.close();

    await conn.sendFile(m.chat, imageName, '', 'Done');

    fs.unlinkSync(imageName);
};

handler.command = /^ss(web)?f?$/i;
handler.help = ['ss', 'ssf'];
handler.tags = ['tools'];
handler.alias = ['ss', 'ssf', 'ssweb', 'sswebf'];

export default handler;
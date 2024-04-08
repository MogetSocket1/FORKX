import puppeteer from 'puppeteer';
import fs from 'fs';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) throw 'الرجاء إدخال رابط URL';
    
    // قائمة بالمواقع المحظورة
    const bannedDomains = ['xnxx', 'pornhub', 'xvideos'];
    const url = args[0].toLowerCase();
    const isBanned = bannedDomains.some(domain => url.startsWith(domain));

    if (isBanned) {
        // حظر المستخدم إذا كان الرابط من موقع محظور
        await conn.blockUser(m.sender, 'تم اكتشاف موقع محظور');
        throw 'تم اكتشاف موقع محظور. لقد تم حظرك.';
    }

    await m.reply('_يتم التحميل، يرجى الانتظار..._');

    // فتح المتصفح باستخدام Puppeteer في وضع headless
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // تعيين user agent لـ iPhone 8 Plus واستخدام عرض الشاشة المحدد
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 414, height: 896 });

    // الانتقال إلى الرابط المحدد
    await page.goto(args[0]);
    
    // التقاط لقطة شاشة للصفحة بالكامل وحفظها كملف
    const imageName = 'screenshot.png';
    await page.screenshot({ path: imageName, fullPage: true });
    
    // إغلاق المتصفح
    await browser.close();

    // إرسال ملف الصورة إلى الدردشة
    await conn.sendFile(m.chat, imageName, '', 'تم');

    // حذف ملف الصورة من النظام
    fs.unlinkSync(imageName);
};

handler.command = /^ss(web)?f?$/i;
handler.help = ['ss', 'ssf'];
handler.tags = ['tools'];
handler.alias = ['ss', 'ssf', 'ssweb', 'sswebf'];

export default handler;
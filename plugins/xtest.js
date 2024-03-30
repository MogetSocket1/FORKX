import puppeteer from 'puppeteer';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.sendMessage(m.chat, 'يرجى تقديم مسار الصورة.', m);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://remaker.ai/features/photo-to-anime/');

  // تحميل الصورة المعطاة كمسار واحد من المدخلات
  const filePath = args[0];
  await page.waitForSelector('#targetUpload');
  const inputUploadHandle = await page.$('#targetUpload');
  await inputUploadHandle.uploadFile(filePath);

  // تأخذ لقطة شاشة بعد تحميل الصورة
  const screenshotPath = './screenshot_with_image.png';
  await page.screenshot({ path: screenshotPath });

  // إرسال الصورة كرد على الرسالة الأصلية مع النص المطلوب
  conn.sendFileLocal(m.chat, screenshotPath, 'screenshot.png', text, m);

  await browser.close();
};

handler.command = /^(test)$/i;
export default handler;
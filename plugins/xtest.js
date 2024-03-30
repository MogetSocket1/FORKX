import fetch from 'node-fetch'
import FormData from 'form-data'
import puppeteer from 'puppeteer';

let handler = async (m) => {
    let q = m.quoted ? m.quoted : m
    let mime = q.mediaType || ''
    if (/image|video|audio|sticker|document/.test(mime)) {
        let media = await q.download(true)
        let data = await uploadFile(media)
        let uploadedUrl = data.files[0].url

        // Fetch the image from the uploaded URL
        const imageResponse = await fetch(uploadedUrl);
        const imageBuffer = await imageResponse.buffer();

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://remaker.ai/features/photo-to-anime/');
        await page.waitForSelector('#targetUpload');
        const inputUploadHandle = await page.$('#targetUpload');
        
        // Upload the image
        await inputUploadHandle.uploadFile({ buffer: imageBuffer, mimeType: 'image/png' });

        // Take a screenshot after uploading the image
        const screenshotPath = './screenshot_with_image.png';
        await page.screenshot({ path: screenshotPath });

        // Send the screenshot as a reply to the original message
        conn.sendFile(m.chat, screenshotPath, 'screenshot.png', 'هنا صورتك:', m);

        await browser.close();
    } else throw 'No media found'
}
handler.command = /^(test)$/i

export default handler

async function uploadFile(path) {
    let form = new FormData()
    form.append('files[]', path)
    let res = await (await fetch('https://uguu.se/upload.php', {
        method: 'post',
        headers: {
            ...form.getHeaders()
        },
        body: form
    })).json()
    return res
}
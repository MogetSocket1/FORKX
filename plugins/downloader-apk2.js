let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    // Replace res with your actual variable holding the app information
    let res = {
        name: "App Name",
        dc: "1000",
        path: "com.example.app",
        size: "10MB"
    };

    let appInfoMessage = `*Name:* ${res.name}\n*Downloads:* ${res.dc}\n*Package:* ${res.path}\n*File Size:* ${res.size}`;
    let img = "https://image.winudf.com/v2/image1/Y29tLmZhY2Vib29rLmxpdGVfaWNvbl8xNjk1NjAyMTk2XzAwNQ/icon.png?w=160&fakeurl=1";

    // استعد الصورة للإرسال
    let media = await prepareWAMessageMedia({ image: { url: img, fileLength: 1000000000000 } }, { upload: conn.waUploadToServer });

    const interactiveMessage = {
        body: { text: appInfoMessage },
        footer: { text: "" },
        header: { title: "Hello world", subtitle: "", hasMediaAttachment: true }, // تم تغيير القيمة إلى true
        nativeFlowMessage: { 
            buttons: [{ 
                name: "quick_reply",
                buttonParamsJson: "{\"display_text\":\"Pemilik bot\",\"id\":\".owner\"}"
            }]
        },
        // إضافة الوسائط المرئية
        media
    };

    const message = { 
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, 
        interactiveMessage 
    };

    await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
};

handler.command = /^(hipo)$/i;
export default handler;
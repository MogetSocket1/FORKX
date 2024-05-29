import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    
    let appInfoMessage = `test`;
    const icon = "./src/avatar_contact.png";
    const interactiveMessage = {
        body: { text: appInfoMessage },
        footer: { text: "_DarkNessMD_" },
        header: {
        hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: icon } }, { upload: conn.waUploadToServer }))
        },
        contextInfo: { 
          	mentionedJid: [m.sender], 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363194444713984@newsletter',
			newsletterName: "DarkNessMD", 
			serverMessageId: -1
		}
          }, 
        nativeFlowMessage: { 
            buttons: [{ 
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"Download","id":".owner"}`
            }]
        }
    };

    const message = { 
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, 
        interactiveMessage 
    };

    await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
    
}

handler.command = /^(test1)$/i;
export default handler;
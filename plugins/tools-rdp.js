import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    try {
        const repoOwner = 'Kbot19';
        const repoName = 'FORKX';
        const githubToken = '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';

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const data = await response.json();
        
        // استخراج أسماء الـ actions النشطة
        const activeActions = data.workflows.filter(workflow => workflow.state === 'active').map(workflow => workflow.name);
        
        // إرسال أسماء الـ actions كرد
        if (activeActions.length > 0) {
            const actionsList = activeActions.join('\n');
            conn.sendMessage(m.chat, `الـ actions النشطة حاليًا:\n${actionsList}`, m);
        } else {
            conn.sendMessage(m.chat, 'لا توجد actions نشطة حاليًا.', m);
        }
    } catch (error) {
        console.error('حدث خطأ:', error);
    }
}

handler.command = /^(action)$/i;

export default handler;
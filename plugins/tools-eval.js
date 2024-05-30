let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!args[0]) throw 'Ex: ' + usedPrefix + command + 'your code';
  let result;
  try {
    result = eval(args.join(' '));
  } catch (error) {
    result = error.toString();
  }
  
  m.reply(result);
};

handler.command = /^(eval)$/i;
export default handler;
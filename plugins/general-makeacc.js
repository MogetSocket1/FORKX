import { createHash } from 'crypto';

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

const handler = async function (m, { conn, text, usedPrefix, command }) {
  const user = global.db.data.users[m.sender];

  // Reset serial number to 1
  let snNumber = 1;

  if (user.registered === true)
    throw `You are already registered\n\nDo you want to overwrite your registration?\n\n 📌Use the command ${usedPrefix}deleteacc`;

  if (!Reg.test(text))
    throw `Incorrect format*\n\n*—◉ Use the command like this: ${usedPrefix + command} name.age*\n*—◉ Example : ${usedPrefix + command} Shadow.18`;

  let [_, name, splitter, age] = text.match(Reg);

  if (!name) throw 'Provide a valid name';
  if (!age) throw 'Specify the age for registration';

  if (name.length >= 30) throw 'The name is too long';
  age = parseInt(age);

  if (age > 100) throw 'How are you still alive with that age? 👴🏻';
  if (age < 5) throw 'A baby who knows how to use WhatsApp? 😲';

  user.name = name.trim();
  user.age = age;
  user.regTime = +new Date;
  user.registered = true;

  let baseName = "DarkNess";
  let originalSn = null;

  // Start checking from snNumber = 1
  while (global.db.data.users[baseName + '-' + (snNumber < 10 ? '0' : '') + snNumber]) {
    snNumber++;
  }

  let sn = baseName + '-' + (snNumber < 10 ? '0' : '') + snNumber;

  // Check for existing serial number in the database
  if (global.db.data.users[sn]) {
    originalSn = sn;
    snNumber++;  // Increase the serial number
    sn = baseName + '-' + (snNumber < 10 ? '0' : '') + snNumber;
  }

  const newSn = sn;  // Set newSn value based on updated sn value
  global.db.data.users[newSn] = m.sender;  // Store the new serial number in the database

  const caption = `*Name :* ${name}
*Age :* ${age} years
*Number serie :* 
${originalSn ? originalSn : newSn}`;
  //await conn.sendMessage(m.chat,caption);
  await m.reply(caption);
  global.db.data.users[m.sender].limit += 100;
  global.db.data.users[m.sender].exp += 10000;
};

handler.help = ['makeacc'];
handler.tags = ['account'];
handler.command = /^(makeacc)$/i;

export default handler;
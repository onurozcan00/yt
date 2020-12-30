const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
//const axios = require('axios')
const moment = require('moment-timezone')
//const get = require('got')
var colors = require('colors');
const { exec } = require('child_process')
const { stdout } = require('process')

moment.tz.setDefault('Europe/Rome').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
		var withNoDigits = ""
        const command = commands.toLowerCase().split(' ')[0] || ''
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
		if (isMedia && type === 'image') {
			console.log(moment().format("H:mm:ss").green+" Sticker "+message.from);
			client.reply(from, 'Al knk kullan', id)
			const mediaData = await decryptMedia(message, uaOverride)
			console.log(moment().format("H:mm:ss").green+" decripto la foto "+message.from);
			const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
			await client.sendImageAsSticker(from, imageBase64)
			console.log(moment().format("H:mm:ss").green+" sticker inviato "+message.from);
		}
		if (isMedia &&(mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10)) {
			const mediaData = await decryptMedia(message, uaOverride)
			console.log(moment().format("H:mm:ss").green+" Sticker Animato "+message.from);
			client.reply(from, 'Al knk kullan', id)
			const filename = `./media/input.${mimetype.split('/')[1]}`
			console.log(moment().format("H:mm:ss").green+" decripto il video "+message.from);
			await fs.writeFileSync(filename, mediaData)
			console.log(moment().format("H:mm:ss").green+" video salvato "+message.from);
			await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
				console.log(moment().format("H:mm:ss").green+" video convertito in gif "+message.from);
				const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
				await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
				console.log(moment().format("H:mm:ss").green+" sticker inviato "+message.from);
			})//
		}
		if(command == '!guida' || command == "!help"){
			console.log(moment().format("H:m:ss").green+": Guida "+message.from);
			client.sendText(message.from,'Collegati al sito https://giphy.com/ \n\nScegli la gif da te preferita\n\nTieni premuto e clicca "Condividi" Se ti trovi su safari\nTieni premuto e clicca "immagine in altra scheda"  Se ti trovi su chrome\n\nPoi invia quel link');
			client.sendText(message.from,"https://youtu.be/aGc8Po8G0Bo  \n\n\nEcco a te una piccola videoguida per safari\n");
			client.sendText(message.from,"https://youtu.be/YBe_7KzvQ_g \n\n\nEcco a te una piccola videoguida per chrome\n");
			client.sendText(message.from,"Se invece vuoi uno sticker statico, manda una foto\n\nN.B. potrebbe prendere solo la parte centrale della foto");
			client.sendText(message.from,"Da oggi puoi anche inviare un video/gif ed esso diventerà uno sticker animato");

		}
		if(command === "!Creator"){
			console.log(moment().format("H:m:ss").green+": Creator "+message.from);
			client.sendText(message.from,"https://www.instagram.com/whataboutclaxl/ \n\n\n https://github.com/Claxl \n\n\nContattami per qualsiasi problema sul bot, se vuoi contribuire alla sua crescita");
		}
		if (text.includes("!yt"))
		{
		   const url = text.replace(/!yt/, "");
		   const exec = require('child_process').exec;
	 
		   var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
	 
		   const ytdl = require("ytdl-core")
		   if (videoid != null)
		   {
			  console.log("video id = ", videoid[1]);
		   }
		   else
		   {
			  conn.sendMessage(id, "gavalid", MessageType.text)
		   }
		   ytdl.getInfo(videoid[1]).then(info =>
		   {
			  if (info.length_seconds > 1000)
			  {
				 conn.sendMessage(id, " videonya kepanjangan", MessageType.text)
			  }
			  else
			  {
	 
				 console.log(info.length_seconds)
	 
				 function os_func()
				 {
					this.execCommand = function (cmd)
					{
					   return new Promise((resolve, reject) =>
					   {
						  exec(cmd, (error, stdout, stderr) =>
						  {
							 if (error)
							 {
								reject(error);
								return;
							 }
							 resolve(stdout)
						  });
					   })
					}
				 }
				 var os = new os_func();
	 
				 os.execCommand('ytdl ' + url + ' -q highest -o mp4/' + videoid[1] + '.mp4').then(res =>
				 {
			 const buffer = fs.readFileSync("mp4/"+ videoid[1] +".mp4")
					conn.sendMessage(id, buffer, MessageType.video)
				 }).catch(err =>
				 {
					console.log("os >>>", err);
				 })
	 
			  }
		   });
	 
		}
		if(body.includes("media")){
			console.log(moment().format("H:mm:ss").green+" giphy "+message.from);
			if(!isNaN(body.charAt(13))){
				console.log(moment().format("H:mm:ss").green+" link con numero, tolgo il numero "+message.from);
				withNoDigits = body.replace(/\d+/,"");
				console.log(moment().format("H:mm:ss").green+withNoDigits);
				console.log(moment().format("H:mm:ss").green+" numero tolto "+message.from);
			}else{
				console.log(moment().format("H:mm:ss").green+" nessun numero "+message.from);
				withNoDigits = body;
				console.log(moment().format("H:mm:ss").green+withNoDigits);
				console.log(moment().format("H:mm:ss").green+" link"+message.from);
			}
			client.sendGiphyAsSticker(message.from,withNoDigits);
			client.sendText(message.from,"Tutto ok! Attendi un attimo");
			console.log(moment().format("H:mm:ss").green+" sticker inviato "+message.from);
		}
    } catch (err) {
        console.log("errore".red)
        //client.kill().then(a => console.log(a))
    }
}

const { translate } = require('./translate')
const express = require("express");
const app = express();
const Botly = require("botly");
const https = require("https");
const axios = require('axios');
const qs = require('qs');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SB_URL, process.env.SB_KEY, { auth: { persistSession: false } });// /** db **/


async function createUser(user) {
    const { data, error } = await supabase
        .from('fbChat')
        .insert([user]);

    if (error) {
        throw new Error('Error creating user : ', error);
    } else {
        return data
    }
};

async function updateUser(id, update) {
    const { data, error } = await supabase
        .from('fbChat')
        .update(update)
        .eq('id', id);

    if (error) {
        throw new Error('Error updating user : ', error);
    } else {
        return data
    }
};
async function userDb(userId) {
    const { data, error } = await supabase
        .from('fbChat')
        .select('*')
        .eq('id', userId);

    if (error) {
        console.error('Error checking user:', error);
    } else {
        return data
    }
};


const botly = new Botly({
    accessToken: process.env.TOKEN,
    verifyToken: process.env.VERIFY,
    notificationType: Botly.CONST.REGULAR,
    FB_URL: "https://graph.facebook.com/v2.6/",
});

app.get("/", function (_req, res) {
    res.sendStatus(200);
});
msgDev = 'مرحبا بكم في بوت (ترجملي) الان  يمكنك كتابة اي نص والبوت يقوم بترجمته الى اي لغة على فور \n قم بمتابعة المطور 👇\n https://www.facebook.com/salah.louktaila\n';// `مرحبا بك في بوت LktText \n الذي يقوم بتحويل  المقطع الصوتي الى نص\n قم باعادة توجيه صوت من اي محادثة الى البوت وسيتم تحويل \n اذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇\n https://www.facebook.com/salah.louktaila`
function MessageTranslate(message, senderId,) {
    msgstart = 'اختر اللغة التي تريد ترجمة النص لها 👇'
    msgVoice = message
    botly.sendText({
        id: senderId,
        text: msgstart,
        quick_replies: [
            botly.createQuickReply("العربية 🇩🇿", "ar"),
            botly.createQuickReply("الأنجليزية 🇺🇸", "en"),
            botly.createQuickReply("الفرنسية 🇫🇷", "fr"),
            botly.createQuickReply("الألمانية 🇩🇪", "de"),
            botly.createQuickReply("الإسبانية 🇪🇸", "es"),
            botly.createQuickReply("الروسية 🇷🇺", "ru"),
            botly.createQuickReply("الإيطالية 🇮🇹", "it"),
            botly.createQuickReply("التركية 🇹🇷", "tr"),
            botly.createQuickReply("الكورية 🇰🇷", "ko"),
            botly.createQuickReply("اليابانية 🇯🇵", "ja"),
            botly.createQuickReply("الهندية 🇮🇳", "hi"),
            botly.createQuickReply("الألبانية 🇦🇱", "sq"),
            botly.createQuickReply("السويدية 🇸🇪", "sv"),
        ]
    });
}
app.use(express.json({ verify: botly.getVerifySignature(process.env.secret) }));
app.use(express.urlencoded({ extended: false }));

app.use("/webhook", botly.router());
msgDev = 'مرحبا بكم في بوت (ترجملي) الان  يمكنك كتابة اي نص والبوت يقوم بترجمته الى اي لغة على فور \n قم بمتابعة المطور 👇\n https://www.facebook.com/salah.louktaila\n';// `مرحبا بك في بوت LktText \n الذي يقوم بتحويل  المقطع الصوتي الى نص\n قم باعادة توجيه صوت من اي محادثة الى البوت وسيتم تحويل \n اذا واجهت اي مشكلة اتصل بالمطور \n حساب المطور 👇\n https://www.facebook.com/salah.louktaila`
let msgVoice
botly.on("message", async (senderId, message) => {
    console.log(senderId)

    if (message.message.text) {
        const user = await userDb(senderId);
        if (user[0]) { // kayen
            MessageTranslate(message.message.text, senderId)
        }
        else {
            //MessageVoice(message.message.text, senderId)
            await createUser({ id: senderId, vip: false })
                .then(async (data, error) => {
                    botly.sendText({ id: senderId, text: msgDev });
                });


        }


    } else if (message.message.attachments[0].payload.sticker_id) {
        botly.sendText({ id: senderId, text: "جام" });
    } else if (message.message.attachments[0].type == "image") {
        botly.sendText({ id: senderId, text: "image" });

    } else if (message.message.attachments[0].type == "audio") {
        botly.sendText({ id: senderId, text: "audio" });



    } else if (message.message.attachments[0].type == "video") {
        console.log(message.message.attachments[0])
        botly.sendText({ id: senderId, text: "فيديو" });
    }
});

botly.on("postback", async (senderId, message, postback) => {
    if (message.postback) {
        if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (postback == "") {
            //
        } else if (message.postback.title == "") {
            //
        } else if (message.postback.title == "") {
            //
        } else if (message.postback.title == "") {
            //
        } else if (message.postback.title == "") {
            //
        }
    } else {

        // botly.sendText({
        //     id: senderId,
        //     text:'انتظر جاري ترجمة'
        // });




        translate(msgVoice, "auto", postback).then(translatedText => {
            botly.sendText({ id: senderId, text: translatedText });
        }).catch(error => {
            console.error("Translation failed:", error);
        });



    }
});

/* ---- PING ---- */

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
    //  keepAppRunning();
});




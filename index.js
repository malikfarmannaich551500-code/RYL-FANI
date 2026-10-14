console.log("RYL FANI WhatsApp Bot");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log("RYL FANI MD BOT CONNECTED!");
        }

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            if (statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log("Dobara WhatsApp connect karna hoga.");
            }
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];

        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation ||
            msg.message.extendedTextMessage?.text || "";

        if (text.toLowerCase() === ".alive") {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "🤖 RYL FANI MD BOT IS ALIVE! 👑"
            });
        }

        if (text.toLowerCase() === ".menu") {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `👑 RYL FANI MD BOT 👑

1. .alive
2. .ping
3. .owner
4. .menu

Made with ❤️ by RYL FANI`
            });
        }

        if (text.toLowerCase() === ".ping") {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "🏓 Pong! RYL FANI MD BOT Active hai."
            });
        }

        if (text.toLowerCase() === ".owner") {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "👑 Owner: RYL FANI"
            });
        }
    });
}

startBot().catch(console.error);

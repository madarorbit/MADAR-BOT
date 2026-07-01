const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "madar_verify_2026";

const ACCESS_TOKEN = "EAAV2Yk7ZC0yYBR6bZBeruJNx1tsvyZA0JC4p46ovG1u1stkaR1oKhcZATFM3gLoASwWT1oaUJD2Ui2r0UER4kW9415kdgKZA3wm2GClmZCZBgUUWQJGLpG3yjg8LBC5sBWNykiVWPnPt4WTrfqLgSYbZBEthCTwDrc2vRLxw0SZADmhqAK7bvdSJRojpjuokklmODwdJjQMGxKilwfAnbVZBygIb7BA54yrwIQjAZDZD";

const PHONE_NUMBER_ID = "1167258523139321";

app.get("/", (req, res) => {
  res.send("MADAR BOT IS RUNNING");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
  }

  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "";

      console.log("MESSAGE:", text);

      await axios.post(
        `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: `أهلًا بك في MADAR 🌟\nوصلت رسالتك: ${text}`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

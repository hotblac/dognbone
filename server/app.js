const express = require("express");
const twilio = require("./twilio");
const app = express();

app.use(express.static('build'));
app.get("/api/makeCall", (req, res) => {
    twilio.makeCall();
    res.sendStatus(200);
});

app.get("/api/token", (req, res) => {
    res.sendStatus(500);
});

app.get("/api/voice", (req, res) => {
    res.sendStatus(500);
});

app.listen(8080, () => {
    console.log("Listening on port 8080!")
});

const express = require("express");
const helmet = require('helmet');
const twilio = require("./twilio");
const app = express();

app.use(helmet());
app.use(express.static('build'));

app.get("/api/token", (req, res) => {
    const token = twilio.token();
    res.send(token);
});

app.post("/api/voice", (req, res) => {
    const outgoingCallTwiML = twilio.voice();
    res.type('text/xml');
    res.send(outgoingCallTwiML);
});

app.listen(8080, () => {
    console.log("Listening on port 8080!")
});

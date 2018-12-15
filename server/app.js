const express = require("express");
const helmet = require('helmet');
const twilio = require("./twilio");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

app.get("/api/token", (req, res) => {
    const token = twilio.token();
    res.send(token);
});

app.post("/api/voice", (req, res) => {
    const outgoingCallTwiML = twilio.voice(req.body.number);
    res.type('text/xml');
    res.send(outgoingCallTwiML);
});

app.listen(8080, () => {
    console.log("Listening on port 8080!")
});

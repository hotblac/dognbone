const express = require("express");
const helmet = require('helmet');
const twilio = require("./twilio");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

app.post("/api/token", (req, res) => {
    const accountSid = req.body.accountSid;
    const authToken = req.body.authToken;
    console.log('Requesting capability token for account SID: ' + accountSid);
    const capabilityToken = twilio.token(accountSid, authToken);
    console.log('Capability token: ' + capabilityToken);
    res.send(capabilityToken);
});

app.post("/api/voice", (req, res) => {
    const outgoingCallTwiML = twilio.voice(req.body.number);
    res.type('text/xml');
    res.send(outgoingCallTwiML);
});

app.listen(8080, () => {
    console.log("Listening on port 8080!")
});

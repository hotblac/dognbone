const express = require("express");
const helmet = require('helmet');
const twilio = require("./twilio");
const app = express();

const version = process.env.npm_package_version;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

app.get("/api/version", (req, res) => {
   res.send(version);
});

app.post("/api/token", (req, res, next) => {
    const accountSid = req.body.accountSid;
    const authToken = req.body.authToken;
    console.log('Requesting capability token for account SID: ' + accountSid);
    twilio.token(accountSid, authToken, (err, token) => {
        if (!err) {
            res.send(token);
        } else {
            console.log("Failed to get capability token: " + err.message);
            res.status(500).json({
                message: err.message
            });
        }
    });
});

app.post("/api/voice", (req, res) => {
    const outgoingCallTwiML = twilio.voice(req.body.number);
    res.type('text/xml');
    res.send(outgoingCallTwiML);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Dognbone server " + version + " running on 8080!");
});

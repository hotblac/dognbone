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

app.post("/api/token", (req, res) => {
    const accountSid = req.body.accountSid;
    const authToken = req.body.authToken;
    console.log('Requesting capability token for account SID: ' + accountSid);

    twilio.verifyCreds(accountSid, authToken)
        .then(() => twilio.token(accountSid, authToken)
            .then(token => res.send(token))
            .catch(error => {
                console.log("Failed to get capability token: " + error.message);
                res.status(500).json({
                    message: error.message
                });
            }))
        .catch(error => {
            console.log('Credential check failed');
            res.status(500).json({
                message: error.message
            });
        });
});

app.post("/api/twilioNumbers", (req, res) => {
    const accountSid = req.body.accountSid;
    const authToken = req.body.authToken;
    console.log('Twilio numbers associated with account SID: ' + accountSid);

    twilio.twilioNumbers(accountSid, authToken)
        .then(phoneNumbers => res.send(phoneNumbers))
        .catch(error => {
            console.log('Failed to find phone numbers');
            res.status(500).json({
                message: error.message
            });
        });
});

app.post("/api/voice", (req, res) => {
    const outgoingCallTwiML = twilio.voice(req.body.number, req.body.callerId);
    res.type('text/xml');
    res.send(outgoingCallTwiML);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Dognbone server " + version + " running on 8080!");
});

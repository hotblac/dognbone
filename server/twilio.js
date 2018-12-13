require('dotenv-safe').load();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const client = twilio(accountSid, authToken);
const ClientCapability = twilio.jwt.ClientCapability;


module.exports = {

    makeCall: () => {
        client.calls
            .create({
                url: 'http://demo.twilio.com/docs/voice.xml',
                to: process.env.TARGET_NUMBER,
                from: process.env.TWILIO_NUMBER
            })
            .then(call => console.log(call.sid))
            .done();
    },

    token: () => {
        const capability = new ClientCapability({
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN
        });

        capability.addScope(
            new ClientCapability.OutgoingClientScope({
                applicationSid: process.env.TWILIO_TWIML_APP_SID})
        );

        return capability.toJwt();
    }
};

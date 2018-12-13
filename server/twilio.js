require('dotenv-safe').load();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const client = twilio(accountSid, authToken);
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = {

    /**
     * Obtain a token with outgoing call capability
     * @returns {string} token
     */
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
    },

    /**
     * Create TwiML for the outgoing call.
     * @returns {string} TwiML describing the outgoing call
     */
    voice: () => {
        const voiceResponse = new VoiceResponse();
        voiceResponse.dial({
            callerId: process.env.TWILIO_NUMBER,
        }, process.env.TARGET_NUMBER);
        return voiceResponse.toString();
    }
};

require('dotenv-safe').load();

const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = {

    /**
     * Obtain a token with outgoing call capability
     * @returns {string} token
     */
    token: (accountSid, authToken) => {
        const capability = new ClientCapability({
            accountSid: accountSid,
            authToken: authToken
        });

        capability.addScope(
            new ClientCapability.OutgoingClientScope({
                applicationSid: process.env.TWILIO_TWIML_APP_SID})
        );

        return capability.toJwt();
    },

    /**
     * Create TwiML for the outgoing call.
     * @param targetNumber number to be called
     * @returns {string} TwiML describing the outgoing call
     */
    voice: (targetNumber) => {
        const voiceResponse = new VoiceResponse();
        voiceResponse.dial({
            callerId: process.env.TWILIO_NUMBER,
        }, targetNumber);
        return voiceResponse.toString();
    }
};

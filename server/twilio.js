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
    },

    /**
     * Get the app SID of the Twilio application.
     *
     * @param accountSid
     * @param authToken
     * @param fn callback to receive (error, appSid)
     */
    appSid: (accountSid, authToken, fn) => {
        const friendlyName = process.env.TWILIO_TWIML_APP_FRIENDLY_NAME;
        const client = require('twilio')(accountSid, authToken);
        console.log('Retrieving application with friendly name \'' + friendlyName + '\'...');

        let found = false;
        let error = null;
        client.applications.each({
            friendlyName: friendlyName,
            callback: (item) => {
                found = true;
                console.log("Found application: " + item.sid);
                fn(error, item.sid);
            },
            done: () => {
                console.log('All applications retrieved ' + found);
                if (!found) {
                    console.log('Application not found: ' + friendlyName);
                    error = Error('Application not found: ' + friendlyName);
                    fn(error, '');
                }
            }
        });
    }
};

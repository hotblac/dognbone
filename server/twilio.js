require('dotenv-safe').load();

const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = {

    /**
     * Verify that the given credentials are correct
     * @param accountSid
     * @param authToken
     * @throws Error if credentials are incorrect
     */
    verifyCreds: (accountSid, authToken) => {
        const client = require('twilio')(accountSid, authToken);
        // Credentials are good if we can make any API call
        return client.api.accounts(accountSid).fetch()
        // On failure, replace the not found error with a more helpful error message
            .catch(() => {throw new Error('Incorrect account SID / Auth Token')});
    },

    /**
     * Obtain a token with outgoing call capability
     * @param accountSid
     * @param authToken
     *
     */
    token: (accountSid, authToken) => {

        const capability = new ClientCapability({
            accountSid: accountSid,
            authToken: authToken
        });

        // Find the SID of the Dog n Bone application associated with this account
        // and add it as a client scope. This allows the client to connect to the app.
        return appSid(accountSid, authToken)
            .then((appSid) => {
                capability.addScope(
                    new ClientCapability.OutgoingClientScope({
                        applicationSid: appSid
                    })
                );
                return capability.toJwt();
            });
    },

    twilioNumbers: (accountSid, authToken) => {
        const client = require('twilio')(accountSid, authToken);
        client.incomingPhoneNumbers.each(incomingPhoneNumber => console.log(incomingPhoneNumber.phoneNumber));
    },

    /**
     * Create TwiML for the outgoing call.
     * @param targetNumber number to be called
     * @param callerId the phone number seen as the source of the call
     * @returns {string} TwiML describing the outgoing call
     */
    voice: (targetNumber, callerId) => {
        const voiceResponse = new VoiceResponse();
        voiceResponse.dial({
            callerId: callerId,
        }, targetNumber);
        return voiceResponse.toString();
    },

};

/**
 * Get the app SID of the Twilio application.
 * The application is looked up by the friendly name configured as an environment variable.
 *
 * @param accountSid
 * @param authToken
 */
function appSid (accountSid, authToken) {
    const friendlyName = process.env.TWILIO_TWIML_APP_FRIENDLY_NAME;
    const client = require('twilio')(accountSid, authToken);
    console.log('Retrieving application with friendly name \'' + friendlyName + '\'...');

    let found = false;
    return new Promise(
        (resolve, reject) => {
            client.applications.each({
                friendlyName: friendlyName,
                callback: app => {
                    found = true;
                    console.log("Found application: " + app.sid);
                    resolve(app.sid);
                },
                done: () => {
                    console.log('Application found: ' + found);
                    if (!found) {
                        console.log('Application not found: ' + friendlyName);
                        reject(new Error('Application not found: ' + friendlyName));
                    }
                }
            });
        }
    );
}

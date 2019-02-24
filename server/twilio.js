require('dotenv-safe').load();

const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

module.exports = {

    /**
     * Obtain a token with outgoing call capability
     * @param accountSid
     * @param authToken
     * @param fn callback to receive (error, jwt)
     *
     */
    token: (accountSid, authToken, fn) => {
        verifyCreds(accountSid, authToken).then(() => {

            const capability = new ClientCapability({
                accountSid: accountSid,
                authToken: authToken
            });

            // Find the SID of the Dog n Bone applicatiom associated with this account
            // and add it as a client scope. This allows the client to connect to the app.
            appSid(accountSid, authToken, (err, appSid) => {
                if (!err) {
                    capability.addScope(
                        new ClientCapability.OutgoingClientScope({
                            applicationSid: appSid
                        })
                    );
                    fn(null, capability.toJwt())
                } else {
                    fn(err, '');
                }
            });

        }).catch(error => {
            console.log("Credential check failed");
            fn(error, '');
        });
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

};

/**
 * Verify that the given credentials are correct
 * @param accountSid
 * @param authToken
 * @throws Error if credentials are incorrect
 */
function verifyCreds(accountSid, authToken) {
    const client = require('twilio')(accountSid, authToken);
    // Credentials are good if we can make any API call
    return client.api.accounts(accountSid).fetch();
}

/**
 * Get the app SID of the Twilio application.
 * The application is looked up by the friendly name conigued as an environment variable.
 *
 * @param accountSid
 * @param authToken
 * @param fn callback to receive each app SID (error, appSid)
 */
function appSid (accountSid, authToken, fn) {
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

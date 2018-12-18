/**
 * Obtain a Twilio capability token for the given account
 * @param accountSid
 * @param authToken
 * @returns {Promise<string>} capability token
 * @throws error on auth failure
 */
export function capabilityToken(accountSid, authToken) {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            accountSid: accountSid,
            authToken: authToken
        })
    };
    return fetch('/api/token', options)
        .then(response => handleErrors(response))
        .then(response => response.text());
}

function handleErrors(response) {
    if (response.ok) return response;
    else throw new Error(response.statusText);
}
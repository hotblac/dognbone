import * as api from "./Backend.api";

const validAccountSid = 'ACffffffffffffffffffffffffffffffff';
const validAuthToken = 'ffffffffffffffffffffffffffffffff';

// Mock API behaviour
const mockCapabilityToken = 'MOCK_CAPABILITY_TOKEN';
const mockTwilioNumber = '+447700900000';
const mockVersionString = "MOCK_VERSION";
beforeEach(() => {
    fetch.resetMocks();
});

describe('capability token api', () => {

    it('should request capability token from api', () => {
        fetch.mockResponseOnce(mockCapabilityToken);
        api.capabilityToken(validAccountSid, validAuthToken);

        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toBe('/api/token');
        expect(fetch.mock.calls[0][1].method).toBe('POST');
        expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({
            accountSid: validAccountSid,
            authToken: validAuthToken
        }));
    });

    it('should return capability token on success', () => {
        fetch.mockResponseOnce(mockCapabilityToken);
        const result = api.capabilityToken(validAccountSid, validAuthToken);
        expect(result).resolves.toBe(mockCapabilityToken);
    });

    it('should throw exception on server error', () => {
        fetch.mockResponseOnce('Error', {status: 500});
        expect(api.capabilityToken(validAccountSid, validAuthToken)).rejects.toEqual(new Error('Internal Server Error'));
    });

});

describe('twilio numbers api', () => {

    it('should request twilio numbers from api', () => {
        fetch.mockResponseOnce(mockTwilioNumber);
        api.twilioNumbers(validAccountSid, validAuthToken);

        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toBe('/api/twilioNumbers');
        expect(fetch.mock.calls[0][1].method).toBe('POST');
        expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify({
            accountSid: validAccountSid,
            authToken: validAuthToken
        }));
    });

    it('should return twilio number on success', () => {
        fetch.mockResponseOnce(mockTwilioNumber);
        const result = api.twilioNumbers(validAccountSid, validAuthToken);
        expect(result).resolves.toBe(mockTwilioNumber);
    });

    it('should throw exception on server error', () => {
        fetch.mockResponseOnce('Error', {status: 500});
        expect(api.twilioNumbers(validAccountSid, validAuthToken)).rejects.toEqual(new Error('Internal Server Error'));
    });

});

describe('version api', () => {

    it('should request version string from api', () => {
        fetch.mockResponseOnce(mockVersionString);
        api.version();

        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toBe('/api/version');
    });

    it('should return version string on success', () => {
        fetch.mockResponseOnce(mockVersionString);
        const result = api.version();
        expect(result).resolves.toEqual(mockVersionString);
    });

    it('should throw exception on server error', () => {
        fetch.mockResponseOnce('Error', {status: 500});
        expect(api.version()).rejects.toEqual(new Error('Internal Server Error'));
    });
});
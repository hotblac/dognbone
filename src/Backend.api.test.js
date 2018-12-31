import { capabilityToken, version } from "./Backend.api";

const validAccountSid = 'ACffffffffffffffffffffffffffffffff';
const validAuthToken = 'ffffffffffffffffffffffffffffffff';

// Mock API behaviour
const mockCapabilityToken = 'MOCK_CAPABILITY_TOKEN';
const mockVersionString = "MOCK_VERSION";
beforeEach(() => {
    fetch.resetMocks();
});

describe('capability token api', () => {

    it('should request capability token from api', () => {
        fetch.mockResponseOnce(mockCapabilityToken);
        capabilityToken(validAccountSid, validAuthToken);

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
        const result = capabilityToken(validAccountSid, validAuthToken);
        expect(result).resolves.toBe(mockCapabilityToken);
    });

    it('should throw exception on server error', () => {
        fetch.mockResponseOnce('Error', {status: 500});
        expect(capabilityToken(validAccountSid, validAuthToken)).rejects.toEqual(new Error('Internal Server Error'));
    });

});

describe('version api', () => {

    it('should request version string from api', () => {
        fetch.mockResponseOnce(mockVersionString);
        version();

        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toBe('/api/version');
    });

    it('should return version string on success', () => {
        fetch.mockResponseOnce(mockVersionString);
        const result = version();
        expect(result).resolves.toEqual(mockVersionString);
    });

    it('should throw exception on server error', () => {
        fetch.mockResponseOnce('Error', {status: 500});
        expect(version()).rejects.toEqual(new Error('Internal Server Error'));
    });
});
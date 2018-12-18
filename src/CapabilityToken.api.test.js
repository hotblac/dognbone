import { capabilityToken } from "./CapabilityToken.api";

const validAccountSid = 'ACffffffffffffffffffffffffffffffff';
const validAuthToken = 'ffffffffffffffffffffffffffffffff';

// Mock API behaviour
const mockCapabilityToken = 'MOCK_CAPABILITY_TOKEN';
beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(mockCapabilityToken);
});

describe('capability token api', () => {

    it('should request capability token from api', () => {
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
        const result = capabilityToken(validAccountSid, validAuthToken);
        expect(result).resolves.toBe(mockCapabilityToken);
    });

    it('should throw exception on server error', () => {
        fetch.resetMocks();
        fetch.mockResponseOnce('Error', {status: 500});
        expect(capabilityToken(validAccountSid, validAuthToken)).rejects.toEqual(new Error('Internal Server Error'));
    });

});
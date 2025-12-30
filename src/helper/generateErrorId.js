import { randomBytes } from 'crypto';

const CHARSET = '0123456789ABCDEFabcdef';

function generateErrorId(length = 32) {
    const bytes = randomBytes(length);
    let id = '';
    for (let i = 0; i < length; i++) {
        id += CHARSET[bytes[i] % CHARSET.length];
    }
    return id;
}

export default generateErrorId;
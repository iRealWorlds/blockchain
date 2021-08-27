import {ec as EC} from 'elliptic';
const elliptic = new EC('secp256k1');

const key = elliptic.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log(`Public key key: ${publicKey}`);
console.log(`Private key: ${privateKey}`);

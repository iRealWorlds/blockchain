import * as sha256 from "crypto-js/sha256";
import { ec as EC } from "elliptic";
const ec = new EC('secp256k1');

export class Transaction {
    public signature: string;

    constructor (public from: string, public to: string, public amount: number)
    {
    }

    calculateHash() {
        return sha256(this.from + this.to + this.amount).toString();
    }

    sign(key: EC.KeyPair) {
        if (key.getPublic('hex') !== this.from) {
            throw new Error('This is not your wallet!');
        }

        const hash = this.calculateHash();
        const signed = key.sign(hash, 'base64');
        this.signature = signed.toDER('hex');
    }

    verifySignature() {
        if (this.from === null) {
            return true;
        }

        if (!this.signature || !this.signature.length) {
            throw new Error('This transaction is not yet signed.');
        }

        
        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
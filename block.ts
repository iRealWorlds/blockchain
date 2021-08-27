import * as sha256 from "crypto-js/sha256";
import { Transaction } from "./transaction";

export class Block {
    public hash: string;
    private nonce = 0;

    constructor (public timestamp: Date,
                public data: Transaction[],
                public previousHash = '') {
        this.previousHash = previousHash;

        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(this.nonce + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty = 1) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            ++this.nonce;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }

    hasValidTransactions() {
        for (const transaction of this.data) {
            if (!transaction.verifySignature()) {
                return false;
            }
        }
        return true;
    }
}
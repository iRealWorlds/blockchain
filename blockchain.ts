import {Transaction} from './transaction';
import {Block} from './block';

export class Blockchain {
    public chain: Block[];
    public difficulty = 2;
    private pendingTransactions: Transaction[] = [];
    private miningReward = 100;

    constructor() {
      this.chain = [
        this.createGenesisBlock(),
      ];
    }

    createGenesisBlock() {
      return new Block(new Date(), [
        new Transaction('', '', 2),
      ]);
    }

    getLatestBlock(): Block|null {
      if (this.chain.length) {
        return this.chain[this.chain.length - 1];
      }
      return null;
    }

    minePendingTransactions(miningRewardAddress: string) {
      const block = new Block(new Date(), [
        ...this.pendingTransactions,
        new Transaction(null, miningRewardAddress, this.miningReward),
      ]);
      block.mineBlock(this.difficulty);

      console.log(`Block successfully mined!`);
      this.chain.push(block);

      this.pendingTransactions = [
      ];
    }

    addTransaction(transaction: Transaction) {
      if (!transaction.from || !transaction.to) {
        throw new Error('A transaction has to have valid to and from addresses.');
      }

      if (!transaction.verifySignature()) {
        throw new Error('Your transaction is not correctly signed.');
      }

      this.pendingTransactions.push(transaction);
    }

    calculateBalance(address: string) {
      let balance = 0;
      for (const block of this.chain) {
        for (const transaction of block.data) {
          if (transaction.from === address) {
            balance -= transaction.amount;
          } else if (transaction.to === address) {
            balance += transaction.amount;
          }
        }
      }
      return balance;
    }

    validateChain() {
      for (let i = 1; i < this.chain.length; i++) {
        const previous = this.chain[i - 1];
        const current = this.chain[i];
        if (current.hash !== current.calculateHash()) {
          return false;
        }
        if (current.previousHash !== previous.hash) {
          return false;
        }

        if (!current.hasValidTransactions()) {
          return false;
        }
      }
      return true;
    }
}

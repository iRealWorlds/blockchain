
import {Blockchain} from './blockchain';
import {Transaction} from './transaction';
import {ec as EC} from 'elliptic';
const ec = new EC('secp256k1');

const key = ec.keyFromPrivate('adbce7d5137efb40db1ea2bc07a3f87f4a727026a9464addd878e3af30a7ce65');
const myWalletAddress = key.getPublic('hex');

const testChain = new Blockchain();

const transaction = new Transaction(myWalletAddress, 'public key goes here', 69);
transaction.sign(key);
testChain.addTransaction(transaction);

console.log('Starting miner...');
testChain.minePendingTransactions(myWalletAddress);

console.log('My balance is:' + testChain.calculateBalance(myWalletAddress));

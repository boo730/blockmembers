const SHA256 = require('crypto-js/sha256');

class transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransctions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2020","Genesis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransctions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransctions = [
            new transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transactions){
        this.pendingTransctions.push(transactions);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }
    /*addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    */

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let kkbCoin = new Blockchain();

kkbCoin.createTransaction(new transaction('address1','address2', 100));
kkbCoin.createTransaction(new transaction('address2','address1', 50));

console.log('\n Starting the miner...');
kkbCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', kkbCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner...');
kkbCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', kkbCoin.getBalanceOfAddress('xaviers-address'));

/*
console.log('Mining block 1...');
kkbCoin.addBlock(new Block(1, "10/04/2020",{ amount: 4}));

console.log('Mining block 2...');
kkbCoin.addBlock(new Block(2, "12/05/2020",{ amount: 10}));
*/

/*
console.log(JSON.stringify(kkbCoin,null,4));
console.log('Is blockchain valid? ' + kkbCoin.isChainValid());

kkbCoin.chain[1].data = { amount: 100 };
kkbCoin.chain[1].hash = kkbCoin.chain[1].calculateHash();

console.log('Is blockchain valid? ' + kkbCoin.isChainValid());
*/
//console.log(JSON.stringify(kkbCoin,null,4));
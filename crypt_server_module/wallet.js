"use strict";

const Record = require('./record');

class Wallet extends Record{

    constructor(id){
        this.publicKeys = [
            'UID',
            'coin',
            'address',
            'user',
            'created_date',
            'personal_use',
            'protected_use',
            'mining',
            'market',
            'local_storage',
            'web_storage',
            'market_id',
            'pool_id'
        ];
    }
    static getWallets(username){
        return new Promise((resolve,reject)=>{
            var wallet = new Wallet();
            wallet.db.table(wallet.table).select('*').where("user = '" + username + "'").execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

module.exports = Wallet;
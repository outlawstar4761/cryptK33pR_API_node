"use strict";

const Record = require('./record');

class Transaction extends Record{

    constructor(id){
        const database = 'crypto';
        const table = 'transactions';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'coin',
            'source',
            'destination',
            'amount',
            'fee',
            'user',
            'created_date'
        ];
    }
    static getTransactions(username){
        return new Promise((resolve,reject)=>{
            var trans = new Transaction();
            trans.db.table(trans.table).select('*').where("user = '" + username + "'").execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

module.exports = Transaction;
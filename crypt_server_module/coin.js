"use strict";

const Record = require('./record');

class Coin extends Record{

    constructor(id){
        const database = 'crypto';
        const table = 'coins';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'coin_name',
            'abbreviation',
            'icon_path',
            'user',
            'created_date',
            'url',
            'mining',
            'staking',
            'algorithm',
            'pow',
            'pos',
            'invested',
            'trading'
        ];
    }
    static getCoins(username){
        return new Promise((resolve,reject)=>{
            var coin = new Coin();
            coin.db.table(coin.table).select('*').where("user = '" + username + "'").execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

class CoinSnapshot extends Record{

    constructor(id) {
        const database = 'crypto';
        const table = 'chains_over_time';
        const primaryKey = 'UID';
        super(database, table, primaryKey, id);
        this.publicKeys = [
            'UID',
            'coin_name',
            'block_height',
            'share_diff',
            'coinbase_value',
            'snapshot_value_usd',
            'algorithm',
            'source',
            'created_date'
        ]
    }
    static getAll(){
        return new Promise((resolve,reject)=>{
            var snapShot = new CoinSnapshot();
            snapShot.db.table(snapShot.table).select('*').execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }

}

module.exports = {
    Coin:Coin,
    CoinSnapshot:CoinSnapshot
};
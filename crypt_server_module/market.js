"use strict";

const Record = require('./record');

class Market extends Record{

    constructor(id){
        const database = 'crypto';
        const table = 'markets';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'market_name',
            'username',
            'password',
            'home_url',
            'user',
            'created_date'
        ];
    }
    static getMarkets(username){
        return new Promise((resolve,reject)=>{
            var market = new Market();
            market.db.table(market.table).select('*').where("user = '" + username + "'").execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

class MarketSnapshot extends Record{

    constructor(id){
        const database = 'crypto';
        const table = 'markets_over_time';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'market',
            'bid',
            'ask',
            'high',
            'low',
            'volume',
            'baseVolume',
            'openSellOrders',
            'openBuyOrders',
            'source',
            'created_date'
        ];
    }
    static getAll(){
        return new Promise((resolve,reject)=>{
            var market = new MarketSnapshot();
            market.db.table(market.table).select('*').execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

module.exports = {
    Market:Market,
    MarketSnapshot:MarketSnapshot
};
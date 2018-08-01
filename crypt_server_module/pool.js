"use strict";

const Record = require('./record');

class Pool extends Record{

    constructor(id){
        const database = 'crypto';
        const table = 'pools';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'pool_name',
            'username',
            'password',
            'home_url',
            'pool_url',
            'user',
            'created_date'
        ];
    }
    static getPools(username){
        return new Promise((resolve,reject)=>{
            var pool = new Pool();
            pool.db.table(pool.table).select('*').where("user = '" + username + "'").execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

module.exports = Pool;
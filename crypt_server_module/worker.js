"use strict";

const Record = require('./record');

class Worker extends Record{

    constructor(id){
        const database = 'crypto_mining';
        const table = 'workers';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'hostname',
            'ip_address',
            'os'
        ];
    }
    static getAll(){
        return new Promise((resolve,reject)=>{
            var worker = new Worker();
            worker.db.table(worker.table).select('*').execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

module.exports = Worker;
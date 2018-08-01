"use strict";

const Record = require('./record');

class QuickLink extends Record{

    constructor(id){
        const database = 'crypto';
        const table = 'quicklinks';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'title',
            'description',
            'url',
            'username',
            'password',
            'user',
            'created_date'
        ];
    }
    static getLinks(username){
        return new Promise((resolve,reject)=>{
            var link = new QuickLink();
            link.db.table(link.table).select('*').where("user = '" + username + "'").execute().then((data)=>{
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
}

module.exports = QuickLink;

// QuickLink.getLinks('outlaw').then(console.log,console.log);
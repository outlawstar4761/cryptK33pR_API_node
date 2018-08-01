"use strict";

const Record = require('./record');

class WorkerStatusSnapShot extends Record{

    constructor(id){
        const database = 'crypto_mining';
        const table = 'worker_status';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'worker_id',
            'status',
            'when',
            'code',
            'msg',
            'description',
            'elapsed',
            'mhs_av',
            'mhs_20s',
            'found_blocks',
            'getworks',
            'accepted',
            'rejected',
            'hardware_errors',
            'utility',
            'discarded',
            'stale',
            'get_failures',
            'local_work',
            'remote_failures',
            'network_blocks',
            'total_mh',
            'diff1_work',
            'work_utility'
        ];
    }
}

module.exports = WorkerStatusSnapShot;
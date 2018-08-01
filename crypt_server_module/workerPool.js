"use strict";

const Record = require('./record');

class WorkerPoolSnapShot extends Record{

    constructor(id){
        const database = 'crypto_mining';
        const table = 'worker_pools';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'worker_id',
            'when',
            'pool',
            'url',
            'status',
            'priority',
            'quota',
            'mining_goal',
            'long_poll',
            'getworks',
            'accepted',
            'rejected',
            'works',
            'discarded',
            'stale',
            'get_failures',
            'remote_failures',
            'user',
            'last_share_time',
            'diff1_share',
            'proxy',
            'difficulty_accepted',
            'difficulty_rejected',
            'difficulty_stale',
            'last_share_difficulty',
            'has_stratum',
            'stratum_active',
            'stratum_url',
            'best_share',
            'pool_rejected_percent',
            'pool_stale_percent'
        ];
    }
}

module.exports = WorkerPoolSnapShot;
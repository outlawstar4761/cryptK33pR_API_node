"use strict";

const Record = require('./record');

class WorkerDeviceSnapShot extends Record{

    constructor(id){
        const database = 'crypto_mining';
        const table = 'worker_pools';
        const primaryKey = 'UID';
        super(database,table,primaryKey,id);
        this.publicKeys = [
            'UID',
            'worker_id',
            'when',
            'pga',
            'name',
            'id',
            'enabled',
            'status',
            'device_elapsed',
            'mhs_av',
            'mhs_20s',
            'mhs_rolling',
            'accepted',
            'rejected',
            'harware_errors',
            'utility',
            'stale',
            'last_share_pool',
            'last_share_time',
            'total_mh',
            'diff1_work',
            'work_utility',
            'difficulty_accepted',
            'difficulty_rejected',
            'difficulty_stale',
            'last_share_difficulty',
            'last_valid_work',
            'device_hardware_percent',
            'device_rejected_percent'
        ];
    }
}

module.exports = WorkerPoolSnapShot;
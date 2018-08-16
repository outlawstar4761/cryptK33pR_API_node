var cryptServer = (function(){
    const http = require('http');
    const database = require('../../db');
    const QuickLink = require('./quickLink');
    const Coin = require('./coin');
    const Market = require('./market');
    const Pool = require('./pool');
    const Wallet = require('./wallet');
    const Transaction = require('./transaction');
    const ACCOUNTS = 'outlawdesigns.ddns.net';
    const ACCOUNTPORT = 9661;
    const RESOURC_ERR = 'Trying to access restricted resource';
    var db = new database('localhost','root','','crypto');
    function httpRequest(host,method,endpoint,params){
        return new Promise(function(resolve, reject){
            var options = {
                hostname:host,
                port:ACCOUNTPORT,
                path:'/' + endpoint,
                method:method,
                headers:{
                    'Content-Type':'application/json; charset=utf-8',
                    "Content-Length": Buffer.byteLength(JSON.stringify(params)),
                }
            };
            if(endpoint === 'authenticate'){
                options.headers.request_token = params.username;
                options.headers.password = params.password;
            }else{
                options.headers.auth_token = params.auth_token;
            }
            var req = http.request(options,function(response){
                var data = '';
                response.on('data',function(chunk){
                    data += chunk;
                });
                response.on('end',function(){
                    resolve(JSON.parse(data));
                });
            }).on('error',function(err){
                reject(err.message);
            });
            req.write(JSON.stringify(params));
        });
    }
    function _verifyToken(token){
        if(token === undefined){
            throw 'Token not present';
        }
        var params = {auth_token:token};
        return new Promise((resolve,reject)=>{
            httpRequest(ACCOUNTS,'GET','verify',params).then((data)=>{
                if(data.error){
                    reject(data.error);
                }
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
    }
    return {
        authenticate:function(req,res,next){
            var params = {
                username:req.headers.request_token,
                password:req.headers.password
            };
            httpRequest(ACCOUNTS,'GET','authenticate',params).then((data)=>{
                if(data.error){
                    res.send(data.error);
                    return;
                }
                res.send(data);
            });
        },
        verifyToken:function(req,res,next){
            _verifyToken(req.headers.auth_token).then((data)=>{
                res.send(req.headers.auth_token);
            },(err)=>{
                res.send(err);
            });
        },
        returnAllQuickLinks:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    QuickLink.getLinks(user.username).then((quickLinks)=>{
                        res.send(quickLinks);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnQuickLink:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var link = new QuickLink(req.params.id);
                    link._build().then((linkData)=>{
                        if(linkData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        res.send(linkData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        updateQuickLink:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var link = new QuickLink(req.params.id);
                    var update = req.body;
                    link._build().then((linkData)=>{
                        if(linkData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        link._setFields(update);
                        link._update().then((linkObj)=>{
                            res.send(linkObj._buildPublicObj());
                        },(err)=>{
                            res.send(err);
                        });
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createQuickLink:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var link = new QuickLink();
                    link.user = user.username;
                    link._setFields(req.body);
                    link._create().then((linkObj)=>{
                        res.send(linkObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllCoins:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Coin.Coin.getCoins(user.username).then((coins)=>{
                        res.send(coins);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnCoin:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var coin = new Coin.Coin(req.params.id);
                    coin._build().then((coinData)=>{
                        if(coinData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        res.send(coinData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        updateCoin:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var coin = new Coin.Coin(req.params.id);
                    var update = req.body;
                    coin._build((coinData)=>{
                        if(coinData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        coin._setFields(update);
                        coin._update().then((coinObj)=>{
                            res.send(coinObj._buildPublicObj());
                        },(err)=>{
                            res.send(err);
                        });
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createCoin:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var coin = new Coin.Coin();
                    coin.user = user.username;
                    coin._setFields(req.body);
                    coin._create().then((coinObj)=>{
                        res.send(coinObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllMarkets:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Market.Market.getMarkets(user.username).then((markets)=>{
                        res.send(markets);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnMarket:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var market = new Market.Market(req.params.id);
                    market._build().then((marketData)=>{
                        if(marketData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        res.send(marketData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        updateMarket:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var market = new Market.Market(req.params.id);
                    var update = req.body;
                    market._build().then((marketData)=>{
                        if(marketData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        market._setFields(update);
                        market._update().then((marketObj)=>{
                            res.send(marketObj._buildPublicObj());
                        },(err)=>{
                            res.send(err);
                        });
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createMarket:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var market = new Market.Market();
                    market.user = user.username;
                    market._setFields(req.body);
                    market._create().then((marketObj)=>{
                        res.send(marketObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllPools:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Pool.getPools(user.username).then((pools)=>{
                        res.send(pools);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnPool:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var pool = new Pool(req.params.id);
                    pool._build().then((poolData)=>{
                        if(poolData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        res.send(poolData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){res.send(err);}
        },
        updatePool:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var pool = new Pool(req.params.id);
                    var update = req.body;
                    pool._build().then((poolData)=>{
                        if(poolData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        pool._setFields(update);
                        pool._update().then((poolObj)=>{
                            res.send(poolObj._buildPublicObj());
                        },(err)=>{
                            res.send(err);
                        });
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createPool:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var pool = new Pool();
                    pool.user = user.username;
                    pool._setFields(req.body);
                    pool._create().then((poolObj)=>{
                        res.send(poolObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllTransactions:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Transaction.getTransactions(user.username).then((transactions)=>{
                        res.send(transactions);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnTransaction:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var transaction = new Transaction(req.params.id);
                    transaction._build().then((transactionData)=>{
                        if(transactionData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        res.send(transactionData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        updateTransaction:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var transaction = new Transaction(req.params.id);
                    var update = req.body;
                    transaction._build().then((transactionData)=>{
                        if(transactionData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        transaction._setFields(update);
                        transaction._update().then((transactionObj)=>{
                            res.send(transactionObj._buildPublicObj());
                        },(err)=>{
                            res.send(err);
                        });
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createTransaction:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var transaction = new Transaction();
                    transaction.user = user.username;
                    transaction._setFields(req.body);
                    transaction._create().then((transactionObj)=>{
                        res.send(transactionObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllWallets:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Wallet.getWallets(user.username).then((wallets)=>{
                        res.send(wallets);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnWallet:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var wallet = new Wallet(req.params.id);
                    wallet._build().then((walletData)=>{
                        if(walletData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        res.send(walletData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        updateWallet:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var wallet = new Wallet(req.params.id);
                    var update = req.body;
                    wallet._build().then((walletData)=>{
                        if(walletData.user !== user.username){
                            res.send(RESOURC_ERR);
                            return;
                        }
                        wallet._setFields(update);
                        wallet._update().then((walletObj)=>{
                            res.send(walletObj._buildPublicObj());
                        },(err)=>{
                            res.send(err);
                        });
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createWallet:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var wallet = new Wallet();
                    wallet.user = user.username;
                    wallet._setFields(req.body);
                    wallet._create().then((walletObj)=>{
                        res.send(walletObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllCoinSnapShots:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Coin.CoinSnapshot.getAll().then((snapshots)=>{
                        res.send(snapshots);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnCoinSnapShot:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var snapshot = new Coin.CoinSnapshot(req.params.id);
                    snapshot._build().then((snapShotData)=>{
                        res.send(snapShotData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createCoinSnapShot:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var snapshot = new Coin.CoinSnapshot();
                    snapshot._setFields(req.body);
                    snapshot._create().then((snaShotObj)=>{
                        res.send(snaShotObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnAllMarketSnapShots:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    Market.MarketSnapshot.getAll().then((snapshots)=>{
                        res.send(snapshots);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        returnMarketSnapShot:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var snapshot = new Market.MarketSnapshot(req.params.id);
                    snapshot._build().then((snapshotData)=>{
                        res.send(snapshotData);
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        createMarketSnapShot:function(req,res,next){
            try{
                _verifyToken(req.headers.auth_token).then((user)=>{
                    var snapshot = new Market.MarketSnapshot();
                    snapshot._setFields(req.body);
                    snapshot._create().then((snapshotObj)=>{
                        res.send(snapshotObj._buildPublicObj());
                    },(err)=>{
                        res.send(err);
                    });
                },(err)=>{
                    res.send(err);
                });
            }catch(err){
                res.send(err);
            }
        },
        translateMinerSummary:function(summary){
            return {
                status:summary.STATUS[0].STATUS,
                when:summary.STATUS[0].When,
                code:summary.STATUS[0].Code,
                msg:summary.STATUS[0].Msg,
                description:summary.STATUS[0].Description,
                elapsed:summary.SUMMARY[0].Elapsed,
                mhs_av:summary.SUMMARY[0]['MHS av'],
                mhs_20s:summary.SUMMARY[0]['MHS 20s'],
                found_blocks:summary.SUMMARY[0]['Found Blocks'],
                getworks:summary.SUMMARY[0].Getworks,
                accepted:summary.SUMMARY[0].Accepted,
                rejected:summary.SUMMARY[0].Rejected,
                hardware_errors:summary.SUMMARY[0]['Hardware Errors'],
                utility:summary.SUMMARY[0].Utility,
                discarded:summary.SUMMARY[0].Discarded,
                stale:summary.SUMMARY[0].Stale,
                get_failures:summary.SUMMARY[0]['Get Failures'],
                local_work:summary.SUMMARY[0]['Local Work'],
                remote_failures:summary.SUMMARY[0]['Remote Failures'],
                network_blocks:summary.SUMMARY[0]['Network Blocks'],
                total_mh:summary.SUMMARY[0]['Total MH'],
                diff1_work:summary.SUMMARY[0]['Diff1 Work'],
                work_utility:summary.SUMMARY[0]['Work Utility']
            };
        },
        translateMinerDevices:function(deviceSummary){
            var devices = [];
            deviceSummary.DEVS.forEach((device)=>{
                var enabled = (device.Enabled === 'Y') ? 1 : 0;
                devices.push({
                    when:deviceSummary.STATUS[0].When,
                    pga:device.PGA,
                    name:device.Name,
                    id:device.ID,
                    enabled:enabled,
                    status:device.Status,
                    device_elapsed:device['Device Elapsed'],
                    mhs_av:device['MHS av'],
                    mhs_20s:device['MHS 20s'],
                    mhs_rolling:device['MHS rolling'],
                    accepted:device.Accepted,
                    rejected:device.Rejected,
                    harware_errors:device['Hardware Errors'],
                    utility:device.Utility,
                    stale:device.Stale,
                    last_share_pool:device['Last Share Pool'],
                    last_share_time:device['Last Share Time'],
                    total_mh:device['Total MH'],
                    diff1_work:device['Diff1 Work'],
                    work_utility:device['Work Utility'],
                    difficulty_accepted:device['Difficulty Accepted'],
                    difficulty_rejected:device['Difficulty Rejected'],
                    difficulty_stale:device['Difficulty Stale'],
                    last_share_difficulty:device['Last Share Difficulty'],
                    last_valid_work:device['Last Valid Work'],
                    device_hardware_percent:device['Device Hardware%'],
                    device_rejected_percent:device['Device Rejected%']
                });
            });
            return devices;
        },
        translateMinerPools:function(poolSummary){
            var pools = [];
            poolSummary.POOLS.forEach((pool)=>{
                pools.push({
                    when:poolSummary.STATUS[0].When,
                    pool:pool.POOL,
                    url:pool.URL,
                    status:pool.Status,
                    priority:pool.Priority,
                    quota:pool.Quota,
                    mining_goal:pool['Mining Goal'],
                    long_poll:pool['Long Poll'],
                    getworks:pool.Getworks,
                    accepted:pool.Accepted,
                    rejected:pool.Rejected,
                    works:pool.Works,
                    discarded:pool.Discarded,
                    stale:pool.Stale,
                    get_failures:pool['Get Failures'],
                    remote_failures:pool['Remote Failures'],
                    user:pool.User,
                    last_share_time:pool['Last Share Time'],
                    diff1_share:pool['Diff1 Shares'],
                    proxy:pool.Proxy,
                    difficulty_accepted:pool['Difficulty Accepted'],
                    difficulty_rejected:pool['Difficulty Rejected'],
                    difficulty_stale:pool['Difficulty Stale'],
                    last_share_difficulty:pool['Last Share Difficulty'],
                    has_stratum:pool['Has Stratum'],
                    stratum_active:pool['Stratum Active'],
                    stratum_url:pool['Stratum URL'],
                    best_share:pool['Best Share'],
                    pool_rejected_percent:pool['Pool Rejected%'],
                    pool_stale_percent:pool['Pool Stale%']
                });
            });
            return pools;
        },
        onSummary:function(args){
            var summary = this.translateMinerSummary(args[0]);
            var summaryObj = new WorkerStatusSnapShot();
            summaryObj._setFields(summary);
            summaryObj._create().then((summaryObj)=>{console.log('Miner Summary Saved.');},console.error);
        },
        onDevice:function(args){
            var summary = this.translateMinerDevices(args[0]);
            var summaryObj = new WorkerDeviceSnapShot();
            summaryObj._setFields(summary);
            summaryObj._create().then((summaryObj)=>{console.log('Device Update Saved.');},console.error);
        },
        onPool:function(args){
            var summary = this.translateMinerPools(args[0]);
            var summaryObj = new WorkerPoolSnapShot();
            summaryObj._setFields(summary);
            summaryObj._create().then(()=>{console.log('Pool Update Saved.');},console.error);
        }
    }
}());

module.exports = cryptServer;

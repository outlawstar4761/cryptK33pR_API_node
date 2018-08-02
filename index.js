const express = require('express');
const bodyParser = require('body-parser');
const autobahn = require('autobahn');
const cryptServer = require('./crypt_server_module');
const Worker = require('./crypt_server_module/worker');
const app = express();
const PORT = 8854;
const WAMPHOST = 'cryptk33prAPI';

var wampConnection = new autobahn.Connection({url:"ws://localhost:8686/ws",realm:'realm1'});
wampConnection.onopen = function(session){
    console.log('Connected to WAMP router...');
    SubscribetoWorkers(session)
    // session.subscribe('scryptminer2.summary',onMinerData);
    // session.subscribe('scryptminer2.device',onMinerData);
    // session.subscribe('scryptminer2.pool',onMinerData);
    // session.subscribe('scryptminer1.summary',onMinerData);
    // session.subscribe('scryptminer1.device',onMinerData);
    // session.subscribe('scryptminer1.pool',onMinerData);
    session.register(WAMPHOST + '.translateSummary',cryptServer.translateMinerSummary).then((req)=>{console.log(WAMPHOST + '.translateSummary registered.');},console.error);
    session.register(WAMPHOST + '.translateDevices',cryptServer.translateMinerDevices).then((req)=>{console.log(WAMPHOST + '.translateDevices registered.');},console.error);
    session.register(WAMPHOST + '.translatePools',cryptServer.translateMinerPools).then((req)=>{console.log(WAMPHOST + '.translatePools registered.');},console.error);
    // session.call('scryptminer2.getSummary');
    // session.call('scryptminer1.getSummary');
}

function SubscribetoWorkers(session){
    var subscriptions = ['summary','device','pool'];
    var methods = ['cryptServer.onSummary','cryptServer.onDevice','cryptServer.onPool'];
    Worker.getAll().then((workers)=>{
        for(var i = 0; i < workers.length; i++){
            for(var j = 0; j < subscriptions.length; j++){
                session.subscribe(workers[i] + '.' + subscriptions[j],methods[j]);
                console.log('Subscribed to ' + workers[i] + '.' + subscriptions[j]);
            }
        }
    },console.error);
}

/*Config*/
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/*Authentication*/
app.get('/authenticate',cryptServer.authenticate);
app.get('/verify',cryptServer.verifyToken);

/*Quick Links*/

app.get('/link',cryptServer.returnAllQuickLinks);
app.get('/link/:id',cryptServer.returnQuickLink);
app.put('/link/:id',cryptServer.updateQuickLink);
app.post('/link',cryptServer.createQuickLink);

/*Coin*/

app.get('/coin',cryptServer.returnAllCoins);
app.get('/coin/:id',cryptServer.returnCoin);
app.put('/coin/:id',cryptServer.updateCoin);
app.post('/coin',cryptServer.createCoin);

/*Market*/

app.get('/market',cryptServer.returnAllMarkets);
app.get('/market/:id',cryptServer.returnMarket);
app.put('/market/:id',cryptServer.updateMarket);
app.post('/market',cryptServer.createMarket);

/*Pool*/

app.get('/pool',cryptServer.returnAllPools);
app.get('/pool/:id',cryptServer.returnPool);
app.put('/pool/:id',cryptServer.updatePool);
app.post('/pool',cryptServer.createPool);

/*Transaction*/

app.get('/transaction',cryptServer.returnAllTransactions);
app.get('/transaction/:id',cryptServer.returnTransaction);
app.put('/transaction/:id',cryptServer.updateTransaction);
app.post('/transaction',cryptServer.createTransaction);

/*Wallet*/

app.get('/wallet',cryptServer.returnAllWallets);
app.get('/wallet/:id',cryptServer.returnWallet);
app.put('/wallet/:id',cryptServer.updateWallet);
app.post('/wallet',cryptServer.createWallet);

/*Chain Update*/

app.get('/chain',cryptServer.returnAllCoinSnapShots);
app.get('/chain/:id',cryptServer.returnCoinSnapShot);
app.post('/chain',cryptServer.createCoinSnapShot);

/*Market Update*/

app.get('/market_history',cryptServer.returnAllMarketSnapShots);
app.get('/market_history/:id',cryptServer.returnMarketSnapShot);
app.post('/market_history',cryptServer.createMarketSnapShot);


app.listen(PORT,()=>{
    console.log('Rest API Listening on port: ' + PORT);
    wampConnection.open();
});
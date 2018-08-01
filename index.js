const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8854;

const cryptServer = require('./crypt_server_module');

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
    console.log('Listening on port: ' + PORT);
});
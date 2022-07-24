const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create()
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
    
const http = require("http");
const express = require("express");
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3333;
app.set('port', port);

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

const server = http.createServer(app);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.get('/getchats',async (req, res) => {
    const chats = await client.getAllChats(false)
  return res.json(chats); 
 });
app.get('/',async (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});
app.post('/send',jsonParser,async (req, res) => {
    console.log(req.body)
    client.sendText(req.body.id, req.body.message, {
        title: req.body.title, 
        footer: req.body.footer, 
        useTemplateButtons: true, // False for legacy
        buttons: req.body.buttons
    });});
 

 server.listen(port);
 
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Wppconnect')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }


  });
}



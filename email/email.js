'use strict';

var express = require('express');
var app = express();

var util = require('util');

var nodemailer = require('nodemailer');

var smtpTrans = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "thebobdeyband@gmail.com",
        pass: "%hF&9*k2"
    },
    debug: true
});
smtpTrans.on('log', console.log);


var bodyParser = require('body-parser');
app.use( bodyParser.json(), function(){} );
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/contact', function (req, res) {
    var mailOpts;


    console.log("WE GOT A MESSAGE :D \n\n");
    console.log(util.inspect(req.body));

    //Mail options
    mailOpts = {
        from: req.body.email,
        replyTo: req.body.email,
        to: 'thebobdeyband@gmail.com',
        subject: 'BDTEM - ' + req.body.subject,
        text: req.body.content
    };
    smtpTrans.sendMail(mailOpts, function (error, response) {

        console.log(util.inspect(mailOpts));

        console.log(util.inspect(response));

        //Email not sent
        if (error) {

            console.log(util.inspect(error));

           res.status(500).end('Error :c');
        }
        //Yay!! Email sent
        else {
            res.status(200).end('Success :)');
        }
    });

});

app.listen(3000);

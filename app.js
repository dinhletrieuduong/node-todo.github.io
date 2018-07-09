var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var ev = require("express-validator");

var path = require('path');
var form = require('express-form');
var field = form.field;

var config = require("./config");
var setupController = require("./api/controllers/setupController");
var todoController = require("./api/controllers/todoController");

var app = express();
app.appName = "Blue";
var port = process.env.PORT || 3000;

app.use("/assets", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ev());

app.use(morgan("dev"));

app.set("view engine", "ejs");

// MongoDb info
//console.log("Conneting: " + config.getDbConnectionString());
mongoose.connect(config.getDbConnectionString(), function (err, db) {
            if (err) throw err;
            console.log("Database created!");
            var collection = db.collection('nodetodos2');
            //console.log(collection );
});
setupController(app);
todoController(app);

app.get("/", function (req, res) {
    res.render("index", { appName: app.appName });
});



app.get("/login", function (req, res) {
    res.render("login", {
        appName: app.appName
    });
});
app.get("/signup", function (req, res) {
    res.render("signup", {
        appName: app.appName
    });
});


/**************************/
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
/*var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "hqace05@gmail.com",
        pass: "Duongcute05"
    }
});
var rand, mailOptions, host, link;*/
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

/*app.get('/', function (req, res) {
    res.sendfile('index.html');
});*/
/*app.get('/send', function (req, res) {
    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://" + req.get('host') + "/verify?id=" + rand;
    mailOptions = {
        to: req.query.to,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end(error);
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});*/

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "hqace05@gmail.com",
        pass: "Duongcute05"
    },
    
        tls: {
            ciphers: 'SSLv3'
        }
});
app.post('/send', function (req, res) {
    host = req.get('host');
    var mailOptions = {
        from: 'Ace ✔ <hqace05@gmail.com>',
        to: req.query.to,
        subject: "Hello " + req.query.to,
        text: 'Hello ' + req.query.to + '✔',
        html: "<p>Hello " + req.query.to + " </p>",
        bcc: req.query.to + "@gmail.com"
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
            res.send(200);
        }
    });
});
app.get('/verify', function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            console.log("email is verified");
            res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
        } else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    } else {
        res.end("<h1>Request is from unknown source");
    }
});

/*--------------------Routing Over----------------------------*/

app.post(// Route
    '/submit',

    // Form filter and validation middleware
    form(
        //field("username").trim().required().is(/^[a-z]+$/),
        field("pwd").trim().required().is(/^[0-9]+$/),
        field("email").trim().isEmail()
    ),

    // Express request-handler now receives filtered and validated data
    function (req, res) {
        if (!req.form.isValid) {
            // Handle errors
            console.log(req.form.errors);

        } else {
            // Or, use filtered form data from the form object:
           // console.log("Username:", req.form.username);
            console.log("pwd:", req.form.password);
            console.log("Email:", req.form.email);
        }
    }
);


/**************************/
app.listen(port, function (params) {
    console.log("App listening on port: " + port);
});
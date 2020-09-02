var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const sgMail = require('@sendgrid/mail');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'Public')))
sgMail.setApiKey("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");
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));

  });

  app.post('/store', (req, res) => {

    MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iCrowdTaskDB");
        var myobj = req.body;
        dbo.createCollection("customers", {
         validator: {
            $jsonSchema: {
               bsonType: "object",
               required: [ "country", "fname", "lname" ],
               properties: {
                  county: {
                     bsonType: "string",
                     description: "must be a string and is required"
                  },
                  fname: {
                     bsonType: "string",
                     description: "name must be a name"
                  },
                  lname: {
                   bsonType: "string",
                   description: "name must be a name"
                },

               }
            }
         }
      },(err,creationResponse)=>{
         if(err){console.log("Database already exist")}

         dbo.collection("customers").insertOne(myobj, function(err, database_response) {
            if (err){
               res.json({state:false,reason:"Data not valid"})
            };

            db.close();

            const msg = {
               to: myobj.email,
               from: 'yoshikasamadhi1996@gmail.com',
               subject: ' to the iCrowd',
               text: 'We warmly welcome you the the Icrowd Commuinty',
               html: '<strong>We warmly welcome you the the Icrowd Commuinty</strong>',
             };
             sgMail.send(msg).then((emailres) => {
                console.log(emailres);

                   res.json({state:true,reason:"Data insert is successful!"})


             }).catch((error) => {
                console.log(error)
                // console.log(error.response.body.errors[0].message)
             })






          });
      })

      });



  });


app.listen(8080);

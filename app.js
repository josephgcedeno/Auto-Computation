var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql')
var app = express();
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var uuid = require('uuid');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",saveUninitialized:true, resave: false}));


app.use(express.static(path.join(__dirname, '/public')));

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '08019899',
    database : 'tut'
});

db.connect((err)=>{
    if(err) throw err
    console.log("Connected to db")
})

app.get("/",(req,res)=>{


    db.query("SELECT * FROM products",(err,result)=>{

        res.render("index",{data:result});
    })
});

app.post("/addorder",(req,res)=>{

   const params = JSON.parse(req.body.data);
   const id = 1 ; // sample id ni sya gikan saiyohang users oke!
   const transaction_id = uuid.v4();

   for(var i = 0; i<params.selected.length;i++){

       var sql = `INSERT INTO transaction (transaction_id, user_id,product_id,quantity,date,mop) VALUES("${transaction_id}","${id}","${params.selected[i].id}",${params.selected[i].quantity},"${params.others.date_ordered}","${params.others.mode}")`;
       db.query(sql);
   }
   res.send(true);

});


app.listen(process.env.PORT||3000);
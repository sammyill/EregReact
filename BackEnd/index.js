const crypto = require('crypto')
const express = require('express')
var cors = require('cors')
const app = express()
var bodyParser = require('body-parser')
const port = 3000
const con = require('./connector');
const jwt=require('jsonwebtoken');
const { path } = require('express/lib/application')
//CALLING MODULES
const defineUserRoutes = require('./usercalls');
const defineModuleRoutes = require('./modulecalls');
const definelectureRoutes = require('./lecturecalls');
var jsonParser = bodyParser.json();

//generate a secretkey for jwt
//let secreykey=require("cripto").randomBytes(64).toString()
//console.log (secreykey)

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

// Enable CORS for all routes
app.use(cors(corsOptions));

defineModuleRoutes(app);
definelectureRoutes(app);
defineUserRoutes(app);

//LASCIARE PER ORA CREAZIONE DI UN UTENTE DI PROVA
app.post('/createtestuser',/*authenticateToken ,*/jsonParser, async (req, res) => {
  let requestbody = req.body;
  try{

    //user validation
    const validation = await con.query(`select id from users where fiscalcode = ?`, [requestbody.fiscalcode]);
    if(validation[0].length < 1)
    {
      var hash = crypto.createHash('sha256').update(requestbody.password).digest('hex');
      //user creation
      const [data] = await con.execute(`insert into users (password,lastname,firstname,phone,email,status,fiscalcode,age) values (?,?,?,?,?,?,?,?)`, [hash, requestbody.lastname, requestbody.firstname, requestbody.phone, requestbody.email, requestbody.status, requestbody.fiscalcode,requestbody.age]);
      res.json(data);
    }else{
      res.json({ error: true, errormessage: "FISCALCODE_EXISTS"});
    }
    
  } catch(err) {
    console.log("Createuser Error: " + err);
    res.json({ error: true, errormessage: "GENERIC_ERROR"});
  }

})

//LISTENING PORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port},let's go`)
  })



//FUNZIONI MIDDLEWARE,LASCIARE PER ORA MA IN FUTURO RIMANGONO SOLO NEI MODULI

//user authentication
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

//AUTHORIZATION CHECK FUNCTION
function autCheck(req,res,next,permits){
  //if the user is the admin he always has permits
  if(req.user.isAdmin===true)  return next();
  //user wanted course
  const course=req.params.idcourse || req.body.idcourse;
  //role level of the requested course
  const authorization=parseInt(req.user.roles.find(cs=>parseInt(cs.idcourse)===parseInt(course)).idrole);
  //checking coordinator authorization
  if (authorization===3 && permits.coordinator===true) return next();
  //checking professor authorization
  if (authorization===2 && permits.professor===true) return next();
  //checking student authorization
  if (authorization===1 && permits.student===true) return next();
  //if the user don't have the authorization 
  return res.sendStatus(403)
}

app.get('/authorizationmiddleext/:idcourse', authenticateToken,(req,res,next)=>autCheck(req,res,next,{coordinator:true}), async (req, res) => {

  let message="the authorization system work,congratulation"
  try {   
      res.json({message:message});
  } catch (err) {
      console.log("Getuser Error:" + err);
      res.json({ error: true, errormessage: "GENERIC_ERROR" });
  }
})

app.get('/authorizationmiddleexttwo/:idcourse', authenticateToken,(req,res,next)=>autCheck(req,res,next,{coordinator:false}), async (req, res) => {

  let message="the authorization system work,congratulation"
  try {   
      res.json({message:message});
  } catch (err) {
      console.log("Getuser Error:" + err);
      res.json({ error: true, errormessage: "GENERIC_ERROR" });
  }
})

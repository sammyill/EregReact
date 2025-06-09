const crypto = require('crypto')
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 3000
const con = require('./connector');
const jwt=require('jsonwebtoken');
const { path } = require('express/lib/application');
var jsonParser = bodyParser.json();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user

        next()
    })
}

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
  
function initAdminUserRoutes(app) {
    /**
     * Sending back the a x(limit) amountof users
     * starting at y(offset) user number
     * where the first name,last name or email contains a term(searchedvalue)
     *is will also send back if there are more user(areusersfinished)
     */
    app.get('/getalltheusers/:offset/:limit/:searchedvalue', authenticateToken, async (req, res) => {
        let offset=req.params.offset;
        let limit=req.params.limit;
        let searchedvalue=req.params.searchedvalue
        const searchedTerm = `%${searchedvalue}%`;
        let areUsersFinished=false;
        try {
            const [users] = await con.execute(`select * from users u 
                                       where CONCAT(firstname, ' ', lastname, ' ', email) 
                                       LIKE ? order by id limit ? offset ?`,
                                        [searchedTerm,limit,offset]);
            if(users.length<=0) areUsersFinished=true;
            res.json({error: false,users: users,areUsersFinished:areUsersFinished});
            console.log(users.length)
        } catch (err) {
            console.log("Getallusers Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

     /**
     * Return
     *The Bio informations of the user as and obj
     *The associated courses of a user as an array of obj
     */
    app.get('/getsingleuser/:id', authenticateToken, async (req, res) => {
        let iduser=req.params.id;
        console.log(iduser)
        try {
            //getting data of the user
            const [user] = await con.execute(`select *  from users u 
                                            where u.id=? `,
                                            [iduser]); 
            const [associatedcourses]=await con.execute(`select c.name,c.startyear,c.endyear,r.name 
                                            from users u 
                                            inner join users_roles_courses urc on urc.id_user =u.id
                                            inner join roles r on r.id =urc.id_role
                                            inner join courses c on c.id=urc.id_course 
                                            where u.id=?`,
                                            [iduser]);
            if(user.length<=0) {
            res.json({erros:true,errosmessage:"INVALID USER"});
            return
            } ;                           
            res.json({error: false,user:user,associatedcourses:associatedcourses});
        } catch (err) {
            console.log("Getuser Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })
     

     /**
     * Return
     *The Bio informations of the user as and obj
     */
       app.get('/getadminself/:id', authenticateToken, async (req, res) => {
        let iduser=req.params.id;
        console.log(iduser)
        try {
            //getting data of the user
            const [user] = await con.execute(`select *  from users u 
                                            where u.id=? `,
                                            [iduser]);
            if(user.length<=0){
               res.json({error:true,errormessage:"INVALID USER"}) 
               return
            }  
            res.json({error: false,userdata:user});
        } catch (err) {
            console.log("Getuser Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
        })

   /**
    * Adding a new user
    * It's not connected to the database,just added
    */
   app.post('/adduser/',authenticateToken ,jsonParser, async (req, res) => {
   let rqbody = req.body;
   try{
 
     //user validation
     const validation = await con.query(`select id from users where fiscalcode = ?`, [rqbody.fiscalcode]);
     if(validation[0].length < 1)
     {
       var hash = crypto.createHash('sha256').update(rqbody.password).digest('hex');
       //user creation
       const [data] = await con.execute(`insert into users (password,lastname,firstname,phone,email,status,fiscalcode,age) values (?,?,?,?,?,?,?,?)`, 
                                       [hash, rqbody.lastname, rqbody.firstname, rqbody.phone, rqbody.email, rqbody.status, rqbody.fiscalcode,rqbody.age]);
       res.json({ error: false,data:data,message:"USER INSERTED SUCCESSFULLY"});
     }else{
       res.json({ error: true, errormessage: "FISCALCODE_EXISTS"});
     }
   } catch(err) {
     console.log("Createuser Error: " + err);
     res.json({ error: true, errormessage: "GENERIC_ERROR"});
   }
 
 })


   /**
    * Udating the informations of a user
    *the user id is required 
    */
    app.patch('/updateuser/:id', jsonParser, authenticateToken, async (req, res) => {
        let patchid = req.params.id;
        let rqbody = req.body;
        try {

            //data validation
            const validation = await con.query(`select id from users where id = ?`,[patchid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER_ID" });
                return;
            }

            //update user
            var hash = crypto.createHash('sha256').update(rqbody.password).digest('hex');
            //update the user
            const [data] = await con.execute(`update users set lastname =? ,firstname =?, phone =?, age=?,email=? ,password=? , status =?, fiscalcode =? where id =?`,
                                                [rqbody.lastname,rqbody.firstname,rqbody.phone,rqbody.age,rqbody.email,hash,rqbody.status,rqbody.fiscalcode,patchid]);
            res.json({ error: false,data:data, message: "DATA SUCCESSFULLY UPDATED" });

        } catch (err) {
            console.log("Updateuser Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })
   

    //resetting the password with a random one
    app.get('/resetpassword', jsonParser, authenticateToken, async (req, res) => {
        //cheating a new random password for the user
        const lwcLetters=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
        const upcLetters=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
        let newpassword="";
        for(let i=0;i<10;i++){
        let randomChoice=Math.floor(Math.random() * 3);
        if (randomChoice===0) newpassword+=Math.floor(Math.random() * 9);
        if (randomChoice===1) newpassword+=lwcLetters[Math.floor(Math.random() * 24)];
        if (randomChoice===2) newpassword+=upcLetters[Math.floor(Math.random() * 24)];
        }
        console.log(newpassword);

        try {
            const validation = await con.query(`select id from users where id = ?`,[req.user.userid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER" });
                return;
            }
            var hash = crypto.createHash('sha256').update(newpassword).digest('hex');
            const data = await con.execute(`update users set password =? where id =?`,[hash,req.user.userid]);
            res.json(data);
        } catch (err) {
            console.log("Updatepwd Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })

    /**
     * deleting and existing user
     * the id is required
     */
    app.delete('/deleteuser/:id', authenticateToken, async (req, res) => {
        let deleteid = req.params.id;
        try {
            //data validation
            const validation = await con.query(`select id from users where id =?`,[deleteid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER_ID" });
                return;
            }

            //delete user
            const [data] = await con.execute(`delete from users where id =?`,[deleteid]);
            res.json({error:false,data:data,message:`UDER DELETED`});
        } catch (err) {
            console.log("Deleteuser Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })
    
}

module.exports = initAdminUserRoutes;
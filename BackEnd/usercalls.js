const crypto = require('crypto')
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const port = 3000
const con = require('./connector');
const jwt=require('jsonwebtoken');
const { path } = require('express/lib/application');
var jsonParser = bodyParser.json();

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
}

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


function initUserRoutes(app) {
    //COMPLETA
    //logging into the server
    //sending toke,user general information,course of the user
    app.post('/login', jsonParser, async (req, res) => {
      let rqbody = req.body;
      try {
        //looking for the user in the database
        var hash = crypto.createHash('sha256').update(rqbody.password).digest('hex');
        const [data] = await con.query(`select u.id as iduser,u.firstname,u.lastname,u.phone,u.age,u.email,u.status,u.fiscalcode, urc.id_role as idrole,r.name as userrole,c.name coursename, urc.id_course as idcourse,c.lenght as courselength,c.startyear as startyear,c.endyear as endendyear from users u
                                        inner join users_roles_courses urc on urc.id_user = u.id
                                        inner join courses c on urc.id_course=c.id
                                        inner join roles r on urc.id_role = r.id
                                        where u.email =? and u.password =? and u.status = 1
                                        order by urc.id_course `,
                                        [rqbody.email,hash]);
        if (data[0].length < 1) {
          res.json({ error: true, errormessage: "INVALID_USERPWD" });
        } else {
            //generate id,courser,role for the token
            const roles=data.map(row=> {
                return{iduser:row.iduser,
                    idcourse:row.idcourse,
                    idrole:row.idrole}; 
            });
            //generate user for the front end
            const user={
                iduser:data[0].iduser,
                firstname:data[0].firstname,
                lastname:data[0].lastname,
                phone:data[0].phone,
                email:data[0].email,
                status:data[0].status,
                fiscalcode:data[0].fiscalcode,
                isAdmin:(data[0]["idrole"]===4)? true:false
            }
            //generate idcourse,name,role for the front end
            const usercourses=data.map(row=> {
                return{
                    idcourse:row.idcourse,
                    coursename:row.coursename,
                    idrole:row.idrole,
                    userrole:row.userrole,
                    courselength:row.courselength,
                    startyear:row.startyear,
                    endyear:row.endendyear
                }; 
            });
          const payload = { username: rqbody.email, userid: data[0]["iduser"], roles: roles,isAdmin:(data[0]["idrole"]===4)? true:false };
          const token = generateAccessToken(payload);
          res.json({ error: false, errormessage: "", token: token ,user:user,usercourses:usercourses});
        }
      } catch (err) {
        console.log("Login Error: " + err);
        res.json({ error: true, errormessage: "GENERIC_ERROR" });
      }
    })

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //                  DEPRECATA
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //get all the users of a course
    app.get('/getallusers/:idcourse', authenticateToken, async (req, res) => {
        let idcourse = req.params.idcourse;
        let data
        let role=req.user.roles.find(rlc=>rlc.idcourse=idcourse).idrole;
        try {
            if(req.user.isAdmin===true || role===3)[data] = await con.execute(`select u.id as iduser,u.firstname,u.lastname,u.imgurl,u.status,r.id as idrole,r.name as rolename from users u
                                                            inner join users_roles_courses urc on urc.id_user =u.id
                                                            inner join roles r on urc.id_role =r.id
                                                            where urc.id_course =?
                                                            order by idrole desc`,
                                                            [idcourse]);
            if(req.userrole===2 || role===1)[data] = await con.execute(`select u.id as iduser,u.firstname,u.lastname,u.imgurl,u.status,r.id as idrole,r.name as rolename from users u
                                                            inner join users_roles_courses urc on urc.id_user =u.id
                                                            inner join roles r on urc.id_role =r.id
                                                            where urc.id_course =? and u.status =1
                                                            order by idrole desc`,
                                                            [idcourse]);
            res.json(data);
        } catch (err) {
            console.log("Getallusers Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })


    /**
     * Return an array of all the active students of a course
     */
    app.get('/getstudents/:idcourse', authenticateToken, async (req, res) => {
        let idcourse = req.params.idcourse;
        let data;
        try {
           [data] = await con.execute(`select u.id as iduser,u.firstname,u.lastname,u.imgurl,r.name as userrole
                                    from users u
                                    inner join users_roles_courses urc on urc.id_user =u.id
                                    inner join roles r on urc.id_role =r.id
                                    where urc.id_course =? and urc.id_role =1 and u.status =1
                                    order by iduser  desc`,
                                    [idcourse]);
            res.json(data);
        } catch (err) {
            console.log("Getallusers Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    
    /**
     * Return an array of all the active professor  of a course
     */
    app.get('/getprofessors/:idcourse', authenticateToken, async (req, res) => {
        let idcourse = req.params.idcourse;
        let data
        let role=req.user.roles.find(rlc=>rlc.idcourse=idcourse).idrole;
        try {
           [data] = await con.execute(`select u.id as iduser,u.firstname,u.lastname,u.imgurl,r.name as userrole,urc.id_role as idrole 
                                    from users u
                                    inner join users_roles_courses urc on urc.id_user =u.id
                                    inner join roles r on urc.id_role =r.id
                                    where urc.id_course =1 and (urc.id_role =2 or urc.id_role  =3) and u.status =1 
                                    order by idrole  desc`,
                                    [idcourse]);
            res.json(data);
        } catch (err) {
            console.log("Getallusers Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    
    /**
     * Return
     *The Bio informations of the user as and obj
     *The attended modules of a user as an array of obj
     *The associated courses of a user as an array of obj
     *The associate modules attendance(four students,void for others)as and array of obj
     */
    app.get('/getuser/:idcourse/:iduser', authenticateToken, async (req, res) => {
        let iduser=req.params.iduser;
        try {
            //getting data of the user
            const [data] = await con.execute(`select u.id as iduser,u.firstname,u.lastname,u.phone,u.age,u.email,u.status,u.fiscalcode ,u.imgurl  from users u 
                                            where u.id=? `,
                                            [iduser]); 
            const [attStudent]=await con.execute(`select  m.id as moduleid,m.lenght as modulelength,m.name as modulename,SUM(TIMESTAMPDIFF(SECOND, aul.entryhour , aul.exithour)) as comulatedattendance from modules m 
                                            inner join users_modules um on um.id_module =m.id
                                            left join lessons l on um.id_module =l.id_modules 
                                            left join attendance_users_lessons aul on aul.id_lesson =l.id and um.id_user =aul.id_user
                                            where um.id_user =?  and um.permit =1 
                                            group by um.id_module`,
                                            [iduser]);                           
            const [tchModules]=await con.execute(`select c.startyear ,c.endyear , c.name as coursename,m.name as modulename,m.id as moduleid from modules m 
                                                inner join users_modules um on um.id_module =m.id
                                                inner join courses c on c.id=m.id_course
                                                where um.id_user =? and um.permit =2`,
                                                [iduser]);
            const [asCourses]=await con.execute(`select c.startyear,c.id as courseid  ,c.endyear , c.name as coursename, r.name as rolename,r.id as idrole from users u 
                                     inner join users_roles_courses urc on urc.id_user =u.id
                                     inner join roles r  on r.id=urc.id_role
                                     inner join courses c on urc.id_course =c.id
                                     where u.id=?`,
                                     [iduser]);
            res.json({userdata:data[0],teachedModules:tchModules,associateCourses:asCourses,studentAttendance:attStudent});
        } catch (err) {
            console.log("Getuser Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    }) 
 
    //DOVREBBE ESSERE GIUSTA,DA PROVARE 
    //get self and only self
       app.get('/getself/:idcourse', authenticateToken, async (req, res) => {
        let iduser=req.user.userid;
        try {
            //getting data of the user
            const [data] = await con.execute(`select u.id as iduser,u.firstname,u.lastname,u.phone,u.age,u.email,u.status,u.fiscalcode ,u.imgurl,r.id as idrole,r.name as rolename  from users u 
                                            inner join users_roles_courses urc on urc.id_user =u.id
                                            inner join roles r on urc.id_role =r.id
                                            where u.id=`,
                                            [iduser]);
            //getting the module done by  the student   
            const [datastud]=await con.execute(`select m.name,m.lenght,um.attendance ,um.absences from modules m 
                                             inner join users_modules um on um.id_module =m.id
                                             where um.id_user =?`,
                                             [iduser]);                           
            //getting the module owned by the professor/coordinator
            const [dataprof]=await con.execute(`select c.name as coursename,m.name as modulename from modules m 
                                                inner join users_modules um on um.id_module =m.id
                                                inner join courses c on c.id=m.id_course
                                                where um.id_user =? and um.permit =2`,
                                                [iduser]);
            //getting the courses owned by the coordinator
            const [datacoord]=await con.execute(`select c.name as coursename from users u 
                                     inner join users_roles_courses urc on urc.id_user =u.id
                                     inner join courses c on urc.id_course =c.id
                                     where urc.id_role =3 and u.id=?`,
                                     [iduser]);
            res.json({userdata:data,modulesowned:dataprof,courseowned:datacoord,modulesdone:datastud});
        } catch (err) {
            console.log("Getuser Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
        })


   
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //                  DEPRECATA
    //    E AGGIUNT AD AMMINUSTRATORE
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   //create a new user inside a course
   app.post('/addnewuser/:idcourse',authenticateToken ,jsonParser, async (req, res) => {
   let idcourse = req.params.idcourse;
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
       const inserteduser=await con.query(`select id from users where fiscalcode = "${rqbody.fiscalcode}"`);
       const iduser=inserteduser[0]["id"];
       //connecting the user to the course
       const [datarolcor]=await con.execute(`INSERT INTO users_roles_courses (id_user, id_role, id_course) VALUES(?,?,?);`,
                                                                                            [iduser,rqbody.role,idcourse])
       //connecting the user to the modules, permit 1 for the students,permit 0 for the professors and coordinator
       const [datamod]=await con.query(` insert into users_modules (id_user,id_module,permit)
                                         select ? as id_user,m.id as id_module,${(rqbody.role===1)? 1:0} as permit from  modules m 
                                         left join users_modules um on um.id_user =?
                                         where m.id_course =?`
                                        ,[iduser,iduser,idcourse])
       
       res.json(`${data} ${datarolcor}${datamod}`);
     }else{
       res.json({ error: true, errormessage: "FISCALCODE_EXISTS"});
     }
     
   } catch(err) {
     console.log("Createuser Error: " + err);
     res.json({ error: true, errormessage: "GENERIC_ERROR"});
   }
 
 })
    

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //                  DEPRECATA
    //    E AGGIUNT AD AMMINUSTRATORE
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //DOBREBBE FUNZIONARE,VA TESTATA
    //update a the user of a course
    app.patch('/updateuserofacourse/:idcourse/:iduser', jsonParser, authenticateToken, async (req, res) => {
        let patchid = req.params.iduser;
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
            const data = await con.execute(`update users set lastname =? ,firstname =?, phone =?, age=?,email=? ,password=? , status =?, fiscalcode =? where id =?`,
                                                [rqbody.lastname,rqbody.firstname,rqbody.phone,rqbody.age,rqbody.email,hash,rqbody.status,rqbody.fiscalcode,patchid]);
            res.json(data,datarole);

        } catch (err) {
            console.log("Updateuser Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })
   

    //--------------------------------------------
    //DEPRECATA
    //----------------------------------------------
    //DOVREBBE FUNZIONARE MA NON DOVREBBE SERVIRE
    //update your own password
    app.patch('/updateownpwd/:idcourse/:iduser', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;
        try {

            //data validation
            const validation = await con.query(`select id from users where id =?`,[rqbody.iduser]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER" });
                return;
            }

            //update user password
            var hash = crypto.createHash('sha256').update(rqbody.password).digest('hex');
            const data = await con.execute(`update users set password =? where id =?`,[hash,rqbody.iduser]);
            res.json(data);

        } catch (err) {
            console.log("Updatepwd Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })

    //--------------------------------------------
    //DEPRECATA
    //----------------------------------------------
    //DOVREBBE FUNZIONARE ,DA PROVARE
    //update your own password
    app.patch('/updatepwd/:idcourse', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;
        try {

            //data validation
            const validation = await con.query(`select id from users where id = ?`,[req.user.userid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER" });
                return;
            }

            //update user password
            var hash = crypto.createHash('sha256').update(rqbody.password).digest('hex');
            const data = await con.execute(`update users set password =? , email=? where id =?`,[hash,rqbody.email,req.user.userid]);
            res.json(data);

        } catch (err) {
            console.log("Updatepwd Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })

    //DOVREBBE FUNZIONARE ,DA PROVARE
    //update your own password
    app.patch('/changepw', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;
        try {
            const validation = await con.query(`select id from users where id = ?`,[req.user.userid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER" });
                return;
            }
            var hash = crypto.createHash('sha256').update(rqbody.password).digest('hex');
            const data = await con.execute(`update users set password =?  where id =?`,[hash,req.user.userid]);
            res.json({error:false, data:data});
        } catch (err) {
            console.log("Updatepwd Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //                  DEPRECATA
    //    E AGGIUNT AD AMMINUSTRATORE
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //resetting the password with a random one
    app.get('/resetmypassword', jsonParser, authenticateToken, async (req, res) => {
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

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //                  DEPRECATA
    //    E AGGIUNT AD AMMINUSTRATORE
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //DOVREBBE ESSERE COMPLETA,DA PROVARE
    //delete a user
    app.delete('/deleteuser/:idcourse/:iduser', authenticateToken, async (req, res) => {
        let deleteid = req.params.id;
        try {
            //data validation
            const validation = await con.query(`select id from users where id =?`,[deleteid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_USER_ID" });
                return;
            }

            //delete user
            const data = await con.execute(`delete from users where id =?`,[deleteid]);
            res.json({error:false,message:`user deleted`});
        } catch (err) {
            console.log("Deleteuser Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })
}

module.exports = initUserRoutes;
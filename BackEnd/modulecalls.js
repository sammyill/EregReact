var bodyParser = require('body-parser')
const con = require('./connector');
const jwt=require('jsonwebtoken');
const { path } = require('express/lib/application');
var jsonParser = bodyParser.json();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
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

function initModuleRoutes(app) {

    //COMPLETA
    //add a module to te course
    app.post('/addmodule', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;

        try {

            //course validation,cannot be presente 2 module with the same name in a course
            const validation = await con.query(`select id from modules where id_course = ? and name=?`,[rqbody.idcourse,rqbody.name]);
            if (validation[0].length < 1) {
                //module creation creation 
                const [data] = await con.execute(`INSERT INTO modules (name, description, lenght, id_course, status) VALUES(?,?,?,?,?);`,
                                                                        [rqbody.name,rqbody.description,rqbody.lenght,rqbody.idcourse,rqbody.status]);
                //module connection
                const dataid = await con.query(`select id from modules where id_course = ? and name= ? and lenght=? and description=?`,
                                                                       [rqbody.idcourse,rqbody.name,rqbody.lenght,rqbody.description]);
                console.log(dataid[0])
                const moduleid=dataid[0][0]["id"];
                console.log(moduleid);
                //setting all students to permit 1,coordinator and professor to 0,and owner to 2
                const [dataconnect]=await con.execute(`INSERT INTO users_modules(id_module,id_user,permit)
                                                       select m.id as id_module,urc.id_user as id_user,if(urc.id_role=1 ,urc.id_role,if(urc.id_user= ? ,2,0)) as permit from modules m 
                                                       inner join users_roles_courses urc on m.id_course =urc.id_course 
                                                       left join users_modules um on um.id_module =m.id 
                                                       where m.id=?`,[rqbody.idprofessor,moduleid]);
                res.json({error:false,message:`module ${rqbody.name} added`});
            } else {
                res.json({ error: true, errormessage: "COURSE_EXISTS" });
            }

        } catch (err) {
            console.log("Createmodule Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })
    
    /*
    aggiorna un modulo
     */
    app.patch('/updatemodule/:idmodule', jsonParser, authenticateToken, async (req, res) => {
        let patchid = req.params.idmodule;
        let rqbody = req.body;
        console.log(rqbody.idcourse,patchid)
        try {

            //Error the course doesn'exist
            let validation = await con.query(`select id from modules where id = ${patchid}`);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_COURSE_ID" });
                return;
            }
            
            //Error there is already a course with the same name
            validation = await con.query(`select id from modules where id_course = ? and name= ? `,[rqbody.idcourse,rqbody.name]);
            if (validation[0].length > 0) {
                res.json({ error: true, errormessage: "COURSE_EXISTS" });
                return;
            }

            //update module
            const data = await con.execute(`update modules SET name= ? , description= ? , lenght= ? , status= ?  where id = ?`,
                                        [rqbody.name,rqbody.description,rqbody.lenght,rqbody.status,patchid]);
            console.log("inserted");
            //disconnection old professor
            const datadiscon=await con.execute(`update users_modules SET permit=0 where permit=2 and id_module=?`,
                                            [patchid]);
            console.log("professor  resetted")
            //connecting new professor
            console.log("new prof connected");
            const datcon = await con.execute(`update users_modules SET permit=2 where id_module=? and  id_user=?`, 
                                            [patchid,rqbody.idprofessor]);
            res.json(data);

        } catch (err) {
            console.log("Updatemodule Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })
 
    //COMPLETA
    //delete a module of the course
    app.delete('/deletemodule/:idcourse/:idmodule', authenticateToken, async (req, res) => {
        let deleteid = req.params.idmodule;
        console.log("message received from the client")
        try {

            //looking if the module exist
            const validation = await con.query(`select id from modules where id =?`,[deleteid]);
            if (validation[0].length < 1) {
                console.log("invalid user course")
                res.json({ error: true, errormessage: "INVALID_COURSE_ID" });
                return;
            }
            //HERE ADD THE LOOKING FOR ASSOCIATED LESSONS
            //YOU NEED TO DO THIS BECAUSE THE ADMIN CAN DELETE IT IN THE ADMIN CLIENT

            //delete module
            const data = await con.execute(`delete from modules where id =?`,[deleteid]);
            res.json({error:false,message:`module deleted`});
        } catch (err) {
            console.log("Deletemodule Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    /** 
     * Getting bak all the module of a course
     * Student and Professor will only get back the module informations
     * Coordinator will also get back the all availeble professor,so they can assigni it to a module
    */
    app.get('/getmodules/:idcourse', authenticateToken, async (req, res) => {
        let data;
        let idcourse = req.params.idcourse;
        let role=req.user.roles.find(rlc=>rlc.idcourse=idcourse).idrole;
        try {
            [data]= await con.execute(` select m.id as idmodule,m.name,m.description,m.lenght,m.status,u.id as idprofessor,u.firstname as firstName,u.lastname as lastName
                                        from modules m
                                        inner join users_modules um on um.id_module =m.id
                                        inner join users u on um.id_user =u.id
                                        where um.permit =2 and m.id_course =? and m.status =1`,[idcourse]) ;
            if(role===2 || role===1){res.json({modules:data});}
            if(role===3){
            const [dataprof]=await con.execute(`select u.id as idprofessor,u.firstname as firstName,u.lastname as lastName from users u 
                                                inner join users_roles_courses urc on urc.id_user =u.id
                                                inner join courses c on urc.id_course =c.id
                                                inner join roles r on urc.id_role =r.id
                                                where c.id=? and (r.id =2 or r.id =3) and u.status =1`,[idcourse]);
            res.json({modules:data,professors:dataprof});
            }
        } catch (err) {
            console.log("Getallmodules Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
        
    })
    
}

module.exports = initModuleRoutes;
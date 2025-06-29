var bodyParser = require('body-parser');
const con = require('./connector');
const jwt=require('jsonwebtoken');
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
  
function initCourseRoutes(app) {
    /**
     * Get the list of all the courses
     */
    app.get('/getallcourses', authenticateToken, async (req, res) => {
        try {
            //getting all che available courses
            const [allCourses] = await con.execute(`select * from courses`);
            res.json({error:false,allCourses:allCourses});
        } catch (err) {
            console.log("Getalllessons Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })
    
    /**
     * Get all the information of a single course
     */
    app.get('/getcourse/:id', authenticateToken, async (req, res) => {
        let courseid=req.params.id;
        try {
            let validation = await con.query(`select id from courses where id = ?`, [courseid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID COURSE" });
                return;
            }
            const [courseData]=await con.execute(`select * from courses where id=?`,[courseid])    
            const [courseUsers]=await con.execute(`select u.firstname,u.lastname ,u.email,r.name as rolename,r.id as roleid 
                                                from users u 
                                                inner join users_roles_courses urc on urc.id_user =u.id
                                                inner join courses c on urc.id_course =c.id
                                                inner join roles r on r.id =urc.id_role
                                                where c.id=? 
                                                order by r.id desc`,[courseid])         
            res.json({error:false,courseData:courseData,courseUsers:courseUsers});
        } catch (err) {
            console.log("Getalllessons Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })
 

    /**
    * Update the information of a single course
    * example of a json body request
    * all the values are required
    * Request body (JSON):
    * {
    *   id: number             //Identifies of the course
    *   name: string           // New course name
    *   lenght: string         // Course duration in years 
    *   startyear: string      // Start year 
    *   endyear: string        // End year 
    *   status: number         // Course status (1 = active, 0 = inactive)
    * }
    */
    app.patch('/updatecourse', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;
        try {
            let validation = await con.query(`select id from courses where id = ?`, [rqbody.id]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID COURSE ID" });
                return;
            }
            const data = await con.query(`UPDATE courses
                                SET name=?, lenght=?, startyear=?, endyear=?, status=?
                                WHERE id=?;`,
                                [rqbody.name,rqbody.lenght,rqbody.startyear,rqbody.endyear,rqbody.status,rqbody.id]);
   
            res.json({ error: false, message: "OPERATION COMPLETED" });
        } catch (err) {
            console.log("Createlesson Error: " + err);
            res.json({ error: true, errormessage: "GENERI ERROR" });
        }
    })

     /**
    * Create a new course
    * example of a json body request
    * all the values are required
    * Request body (JSON):
    * {
    *   name: string           // New course name
    *   lenght: string         // Course duration in years 
    *   startyear: string      // Start year 
    *   endyear: string        // End year 
    *   status: number         // Course status (1 = active, 0 = inactive)
    * }
    */
    app.post('/createcourse', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;
        try {
            let validation = await con.query(`select id from courses 
                                            where name = ? and startyear=? and  endyear=? `,
                                            [rqbody.name,rqbody.startyear,rqbody.endyear]);
            if (validation[0].length < 1) {
            const [data]=await con.query(`INSERT INTO courses
                                        (name, lenght, startyear, endyear, status)
                                        VALUES(?,?,?,?,?);`,
                                        [rqbody.name,rqbody.lenght,rqbody.startyear,rqbody.endyear,rqbody.status])
            res.json({ error: false, message: "COURSE INSERTED" })
            }else{
                res.json({ error: true, errormessage: "COURSE ALREADY EXIST" })
            }
        } catch (err) {
            console.log("Updatelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })


    /**
     * Delete a course
     */
    app.delete('/deletecourse/:id', authenticateToken, async (req, res) => {
        let deleteid = req.params.id;
        try {
            const validation = await con.query(`select id from courses where id = ?`, [deleteid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID COURSE ID" });
                return;
            }
            const data = await con.execute(`delete from courses where id = ?`, [deleteid]);
            res.json({error:false , data:data, message:"OPERATION COMPLETED"});
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    //ADMIN ROUTES
        /**
         * Connect a new user to the course
         * courseid,userid and roleid are required
         */
    app.post('/connectuser', authenticateToken, async (req, res) => {
        let idcourse = req.body.idcourse;
        let iduser = req.body.iduser;
        let idrole=req.body.idrole
        try {
            let validation = await con.query(`select id from courses where id = ?`, [idcourse]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID COURSE ID" });
                return;
            }
            validation = await con.query(`select id from users where id = ?`, [iduser]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID USER ID" });
                return;
            }
            validation = await con.query(`select id from roles where id = ?`, [idrole]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID ROLE ID" });
                return;
            }

            const data = await con.execute(`INSERT INTO ereg.users_roles_courses
                                        (id_user, id_role, id_course)
                                        VALUES(?,?,?);`, [iduser,idrole,idcourse]);
            res.json({error:false , data:data, message:"OPERATION COMPLETED"});
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    /**
     * change the role of a user in the course
     */
    app.patch('/changeuserrole/:iduser/:idrole/:idcourse', authenticateToken, async (req, res) => {
        let idcourse = req.body.idcourse;
        let iduser = req.params.iduser;
        let idrole=req.params.idrole
        try {
            let validation = await con.query(`select id from courses where id = ?`, [idcourse]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID COURSE ID" });
                return;
            }
            validation = await con.query(`select id from users where id = ?`, [iduser]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID USER ID" });
                return;
            }
            validation = await con.query(`select id from roles where id = ?`, [idrole]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID ROLE ID" });
                return;
            }

            const data = await con.execute(`UPDATE ereg.users_roles_courses
                                        SET id_role=? 
                                        WHERE id_user=? AND id_course=?;`, [idrole,iduser,idcourse]);
            res.json({error:false , data:data, message:"OPERATION COMPLETED"});
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    /**
     * Remove(unlink) the association between a user and a course
     */
    app.delete('/unlinkuser/:iduser/:idcourse', authenticateToken, async (req, res) => {
        let idcourse = req.body.idcourse;
        let iduser = req.params.iduser;
        try {
            let validation = await con.query(`select id from courses where id = ?`, [idcourse]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID COURSE ID" });
                return;
            }
            validation = await con.query(`select id from users where id = ?`, [iduser]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID USER ID" });
                return;
            }

            const data = await con.execute(`DELETE FROM ereg.users_roles_courses
                                           WHERE id_user=?  AND id_course=?;`, 
                                           [iduser,idcourse]);
            res.json({error:false , data:data, message:"OPERATION COMPLETED"});
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })




}

module.exports = initCourseRoutes;
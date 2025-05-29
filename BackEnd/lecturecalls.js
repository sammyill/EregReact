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
  
function initLessonRoutes(app) {

    /**
    * Retunr all the lessons of a month
    * Retunr the lessons list
    * Retunr if there are lessons previous that month
    * Return if ther are lessons after that month
    * Return the list of all the modules of the course
    */
    app.get('/getalllessons/:idcourse/:month/:year', authenticateToken, async (req, res) => {
        let month=req.params.month;
        let year=req.params.year;
        let idcourse=req.params.idcourse;
        try {
            //getting alle the lessond of the requested month
            const [allMonthLesson] = await con.execute(`select l.id as idlesson,m.name as modulename,l.notes as notes,u.firstname ,u.lastname ,l.begindate,l.enddate,l.completed as completionstatus from lessons l 
                                                    inner join modules m on l.id_modules =m.id
                                                    inner join courses c on c.id=m.id_course 
                                                    inner join users_modules um on um.id_module =m.id and um.permit =2
                                                    inner join users u on u.id=um.id_user 
                                                    where c.id= ? and month (l.begindate)= ? and year(l.begindate)=?
                                                    order by l.begindate asc`,[idcourse,month,year]);
            //getting the the first lessond of the course by date
            const [firstdate] = await con.execute(`select l.begindate from lessons l 
                                            inner join modules m on l.id_modules =m.id
                                            inner join courses c on c.id=m.id_course 
                                            where c.id= ?
                                            order by l.begindate asc
                                            limit 1`,[idcourse]);
            //getting the last lesson of the course by date
            const [lastdate] = await con.execute(`select l.begindate from lessons l 
                                        inner join modules m on l.id_modules =m.id
                                        inner join courses c on c.id=m.id_course 
                                        where c.id= ? 
                                        order by l.begindate desc
                                        limit 1`,[idcourse]);
            //getting all the modules(removere and don't send if you are not a coord)
            const [datamodules]= await con.execute(` select m.id as idmodule,m.name
                                        from modules m
                                        inner join users_modules um on um.id_module =m.id
                                        inner join users u on um.id_user =u.id
                                        where um.permit =2 and m.id_course =? `,[idcourse]) ;
            let previousDate=new Date(firstdate[0]["begindate"]);
            let nextDate=new Date(lastdate[0]["begindate"]);
            let firstLesson=new Date(allMonthLesson[0]["begindate"]);
            let lastLesson=new Date(allMonthLesson[allMonthLesson.length-1]["begindate"])
            let previous=(previousDate<firstLesson) ? true:false;
            let next=(nextDate>lastLesson) ? true:false;
            const data={
                allMonthLessons: allMonthLesson,
                previous: previous,
                next: next,
                allmodules:datamodules
            }
            res.json(data);
        } catch (err) {
            console.log("Getalllessons Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })
    

    //DOVEBBE FUNZIONARE,DA CONTROLLARE
    //getting a single lesson
    app.get('/getalesson/:idcourse/:idlesson', authenticateToken, async (req, res) => {
        let idcourse=req.params.idcourse;
        let lessonid = req.params.idlesson;
        try {
            //the lesson doens't exist 
            let validation = await con.query(`select id from lessons where id = ?`, [patchid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_LESSON_ID" });
                return;
            }
            //getting alle the lesson informations
            const [lesson] = await con.execute(`select l.id as idlesson,l.title,l.description ,l.begindate,l.enddate,m.name as modulename,u.firstname,u.lastname,u.id as idowner from lessons l 
                                                inner join modules m on m.id=l.id_modules 
                                                inner join users_modules um on l.id_modules =um.id_module and um.permit =2
                                                inner join users u on um.id_user =u.id 
                                                 where l.id=?`,[lessonid]);
            //geting the entry and exit  hours of the students that attended the course
            const [completionist] = await con.execute(`select u.firstname,u.lastname,aul.entryhour,aul.exithour from lessons l
                                                       inner join attendance_users_lessons aul on aul.id_lessons =l.id 
                                                       inner join users u on aul.id_users =u.id
                                                       where l.id=1`,[lessonid]);
            //getting the students that need to attend the course
            const [futurecompletionistt] = await con.execute(`select u.firstname,u.lastname,u.id as iduser from lessons l 
                                                            inner join modules m on m.id =l.id_modules 
                                                            inner join courses c on c.id =m.id_course 
                                                            inner join users_roles_courses urc on urc.id_course =c.id 
                                                            inner join users u on urc.id_user =u.id 
                                                            where l.id=? and urc.id_role =1 and u.status =1`,[lessonid]);
            const [allmodules]=await con.execute(`select m.id as idmodule,m.name as modulename from modules m 
                                                   where m.id_course =?`,[idcourse])             
            const data={
                lessondetails: lesson,
                studLDone: completionist,
                studLFuture: futurecompletionistt,
                allmodules:allmodules
            }
            res.json(data);
        } catch (err) {
            console.log("Getalllessons Error:" + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })


    /**
    * Create a lesson
    * id module,the starting time and ending time are required
    */
    app.post('/createlesson', jsonParser, authenticateToken, async (req, res) => {
        let rqbody = req.body;
        const itIsNow=new Date();
        const begindate=new Date(rqbody.begindate);
        const enddate=new Date(rqbody.enddate);
        if(begindate>enddate){
               res.json({ error: true, errormessage: "END IS EARLIER THAN BEGIN" });
               return
            }
        if(begindate<itIsNow){
              res.json({ error: true, errormessage: "CANNOT CREATE LESSON IN THE PAST" });
              return
            }
        try {
           
            
            //the module doesen't exist 
            let validation = await con.query(`select id from modules where id = ?`, [rqbody.idmodule]);
                if (validation[0].length < 1) {
                    res.json({ error: true, errormessage: "INVALID_MODULE_ID" });
                    return;
                }
            //the course doent's exist  
            validation = await con.query(`select id from courses where id = ?`, [rqbody.idcourse]);
                if (validation[0].length < 1) {
                    res.json({ error: true, errormessage: "INVALID_COURSE_ID" });
                    return;
                }

            //there cannot be  two lesson in the same hours 
            validation = await con.query(`select l.id from lessons l 
                                    inner join modules m on m.id=l.id_modules 
                                    inner join courses c on m.id_course =c.id 
                                    where c.id=? and ? between l.begindate and l.enddate 
                                    or ? between l.begindate and l.enddate or (?<l.begindate and ?>l.enddate )`,
                                    [rqbody.idcourse, rqbody.begindate, rqbody.enddate,rqbody.begindate,rqbody.enddate]);
            if (validation[0].length < 1) {
                //lesson creation
                const [data] = await con.execute(`insert into lessons (begindate,enddate,id_modules) values (?,?,?)`, 
                                                [rqbody.begindate, rqbody.enddate, rqbody.idmodule]);
                res.json({error:false,data:data});
            } else {
                res.json({ error: true, errormessage: "LESSON_ALREADY_EXISTS_IN_THE_SAME_TIME" });
            }

        } catch (err) {
            console.log("Createlesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })


    /**
     * Only the begin and the end can be modified
     * and only if the lessons hasn't already started
     */
    app.patch('/updatelesson/:idcourse/:idlesson', jsonParser, authenticateToken, async (req, res) => {
        let courseid=req.params.idcourse
        let patchid = req.params.idlesson;
        let rqbody = req.body;
        const itIsNow=new Date();
        const begindate=new Date(rqbody.begindate);
        const enddate=new Date(rqbody.enddate);
        if(begindate>enddate){
               res.json({ error: true, errormessage: "END IS EARLIER THAN BEGIN" });
               return
            }
        if(begindate<itIsNow){
              res.json({ error: true, errormessage: "CANNOT CREATE LESSON IN THE PAST" });
              return
        }
        try {

            //the lesson doens't exist  or has already started
            let validation = await con.query(`select id from lessons where id = ? and completed=0`, [patchid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "LESSON_DOESNT_EXIST_OR_HARS_ALDREADY_STARTED" });
                return;
            }
            //there is already a lesson in the same hours 
            validation = await con.query(`select l.id from lessons l 
                                          inner join modules m on m.id=l.id_modules 
                                          inner join courses c on m.id_course =c.id 
                                          where c.id=? and l.id <>? and ? between l.begindate and l.enddate 
                                          or ? between l.begindate and l.enddate or (?<l.begindate and ?>l.enddate )`,
                                           [courseid, patchid, rqbody.begindate, rqbody.enddate,rqbody.begindate,rqbody.enddate]);
            if (validation[0].length > 0) {
                res.json({ error: true, errormessage: "LESSON_ALREADY_EXISTS_IN_THE_SAME_HOURS" });
                return;
            }

            //update lesson
            const data = await con.execute(`update lessons set begindate = ?, enddate = ? where id = ?`,
                                                 [rqbody.begindate, rqbody.enddate, patchid]);
            res.json({error:false,data:data});

        } catch (err) {
            console.log("Updatelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }

    })


    /**
     * A lesson can be delete only is it hasn't haleady started
     */
    app.delete('/deletelesson/:idcourse/:id', authenticateToken, async (req, res) => {
        let deleteid = req.params.id;
        try {
            //data validation
            const validation = await con.query(`select id from lessons where id = ? and completed=0 `, [deleteid]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "INVALID_LESSON_ID_OR LESSON_HAS_ALREADY_STARTED" });
                return;
            }

            //delete lesson
            const data = await con.execute(`delete from lessons where id = ?`, [deleteid]);
            res.json({error:false,date:data});
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

    //DOVREBBE FUNZIONARE,DA CONTROLLARe
    //starting the lesson and connecting all the student
    app.get('/startlesson/:idcourse/:idlesson', jsonParser, authenticateToken, async (req, res) => {
        let idlesson=req.params.idlesson;
        let iduser=req.user.iduser
        try {
            //looking for the enddate and the id of the propietary of the course
            const validation = await con.query(`select l.begindate as begindate ,um.id_user as idowner,l.completed as completed from lessons l
                                            inner  join users_modules um on um.id_module =l.id_modules
                                            inner join users u on um.id_user =u.id
                                            where l.id ? and um.permit =2`,
                                               [idlesson]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "ERROR,THE LESSON DOESN'T EXIST " });
                return;
            }
            //the lesson has already been ARCHIEVED
            if(validation[0]["completed"]===1){
                res.json({ error: true, errormessage: "THE LESSON HAS ALREADY BEEN ARCHIEVED,NOT ALLOWED" });
                return;
            }
            //the lesson hasn't begun yes
            const date = new Date()
            if(date<validation[0]["begindate"]){
                res.json({ error: true, errormessage: "THE LESSON HASN'T BEGUN YET,CANNOT START" });
                return;
            }
            //the user trying to end the lesson is not the owner of the lesson
            if(parseInt(iduser)!==parseInt(validation[0]["idowner"])){
                res.json({ error: true, errormessage: "YOU ARE NOT THE OWNER,NOT ALLOWED" });
                return;
            }

            //Conncting alle the student to the lesson ans set enty and exit to null
            const data = await con.execute(`insert into attendance_users_lessons (id_lessons,id_users )
                                            select l.id as idlesson,um.id_user as iduser  from lessons l 
                                            inner join users_modules um on um.id_module =l.id_modules
                                            where l.id =? and um.permit =1 `, 
                                            [rqbody.idlesson]);
            
            res.json(data);
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })


    //DOVREBBE FUNZIONARE,DA CONTROLLARE
    //register the presence of a student to the lesson,also create the presence
    app.post('/createattendance', authenticateToken, async (req, res) => {
        let rqbody = req.body;
        try {
            //looking if the student is enrollend in the course
            const validation = await con.query(`select urc.id_user as iduser,l.begindate begindate  from lessons l 
                                                inner join modules m on l.id_modules =m.id
                                                inner join users_roles_courses urc on urc.id_course =m.id_course
                                                where urc.id_user =? and urc.id_role =1 and l.id=?`, [rqbody.iduser,rqbody.idlesson]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "THE USER CANNOT ATTEND THIS LESSON" });
                return;
            }
            const date = new Date()
            //if the lesson hasn't already started
            if(date<validation[0]["begindate"]){
                res.json({ error: true, errormessage: "THE LESSON HASN'T ALREADY STARTED" });
                return;
            }
            //creating the attendance to the lesson
            const data = await con.execute(`UPDATE attendance_users_lessons 
                                          set entryhour=?
                                          where id_user=? and  id_lesson=?;`, 
                                          [rqbody.entryhour,rqbody.iduser,rqbody.idlesson]);
            res.json(data);
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    });

    //DOVREBBE ESSERE FINITA,DA PROVARE
    //register the hourse of leaving the lesson early
    app.patch('/leavinglesson/:idcourse', authenticateToken, async (req, res) => {

        let rqbody = req.body;
        try {
            //looking if the student is attending the lessong
            const validation = await con.query(`select aul.entryhour as entryhour,l.enddate as enddate from attendance_users_lessons aul 
                                                inner join lessons l on l.id=aul.id_lesson
                                                where aul.id_user =? and aul.id_lesson =?`,
                                                [rqbody.iduser,rqbody.idlesson]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "THE USER HASN'ALREADY ATTEND THE LESSON" });
                return;
            }
            const date = new Date()
            //the lesson has already ended
            if(date>validation[0]["enddate"]){
                res.json({ error: true, errormessage: "THE LESSON HAS ALREADY ENDED " });
                return;
            }
            //adding the early leave of a student 
            const data = await con.execute(`UPDATE attendance_users_lessons
                                            SET exithour=?
                                            WHERE id_user=? AND id_lesson=?;`, 
                                        [rqbody.exithour,rqbody.iduser,rqbody.idlesson]);
            res.json(data);
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    });

    //DOVREBBE ESSERE CORRETTO;DA CONTROLLARE
    //ending the lesson
    app.get('/endthelesson/:idcourse/:idlesson', jsonParser, authenticateToken, async (req, res) => {
        let idcourse = req.params.idcourse;
        let idlesson=req.params.idlesson;
        let iduser=req.user.iduser
        try {
            //looking for the enddate and the id of the propietary of the course
            const validation = await con.query(`select l.enddate as enddate ,um.id_user as idowner,l.completed as completed from lessons l
                                            inner  join users_modules um on um.id_module =l.id_modules
                                            inner join users u on um.id_user =u.id
                                            where l.id ? and um.permit =2`,
                                               [idlesson]);
            if (validation[0].length < 1) {
                res.json({ error: true, errormessage: "ERROR,THE LESSON DOESN'T EXIST " });
                return;
            }
            //the lesson has already been ARCHIEVED
            if(validation[0]["completed"]===1){
                res.json({ error: true, errormessage: "THE LESSON HAS ALREADY BEEN ARCHIEVED,NOT ALLOWED" });
                return;
            }
            //the lesson hasn't and yet 
            const date = new Date()
            if(date<validation[0]["enddate"]){
                res.json({ error: true, errormessage: "THE LESSON HASN'T ENDED YET " });
                return;
            }
            //the user trying to end the lesson is not the owner of the lesson
            if(parseInt(iduser)!==parseInt(validation[0]["idowner"])){
                res.json({ error: true, errormessage: "YOU ARE NOT THE OWNER,NOT ALLOWED" });
                return;
            }

            //adding the exit  our to all student
            const data = await con.execute(`UPDATE attendance_users_lessons 
                                            SET  exithour =? , completed=1
                                            WHERE id_lesson = ? and exithour is null;`, 
                                        [validation[0]["enddate"],rqbody.idlesson]);
            //adding the hour attended to the table user modules
            const dataend=await con.execute(`UPDATE users_modules um
                                        join(
                                        select sum(TIME_TO_SEC(aul.exit-aul.entry))as attendance,
                                        SUM(if(aul.entry is null,TIME_TO_SEC(l.enddate-l.begindate),TIME_TO_SEC(l.enddate-l.begindate)+ TIME_TO_SEC(aul.entryhour- aul.exithour))) as abscence,
                                        aul.id_users as iduser,
                                        l.id_modules as idmodules 
                                        from attendance_users_lessons aul
                                        inner join lessons l on l.id =aul.id_lessons
                                        inner join modules m on l.id_modules =m.id
                                        where l.id_modules = (select l.id_modules from lessons l where l.id=1 )
                                        group by aul.id_users 
                                        ) as myupdate on um.id_user=myupdate.iduser and um.id_module=myupdate.idmodules
                                        SET  um.attendance=myupdate.attendance , um.absences=myupdate.abscence`)
            
            res.json(data);
        } catch (err) {
            console.log("Deletelesson Error: " + err);
            res.json({ error: true, errormessage: "GENERIC_ERROR" });
        }
    })

 




}

module.exports = initLessonRoutes;
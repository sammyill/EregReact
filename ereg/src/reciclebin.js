app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';

  username = username.replace(/[!@#$%^&*]/g, '');

  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }

  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});


//DENTRO GETTING A SINGLE LESSON
        /* NON SERVE PIU'
            const nowDate=new Date();
            console.log(nowDate)
            console.log(lesson[0].enddate)
            if(nowDate>lesson[0].enddate){

            }
            */
           /* NON SERVE PIU'
            //geting the entry and exit  hours of the students that attended the course
            const [completionist] = await con.execute(`select u.firstname,u.lastname,aul.entryhour,aul.exithour from lessons l
                                                       inner join attendance_users_lessons aul on aul.id_lesson =l.id 
                                                       inner join users u on aul.id_user =u.id
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
                students: students,
                studLDone: completionist,
                studLFuture: futurecompletionistt,
                allmodules:allmodules
            }
                */
//chiamare deprecate da lecture calls
    // DERPCATA
    //DOVREBBE FUNZIONARE,DA CONTROLLARE
    //register the presence of a student to the lesson,also create the presence
    app.post('/createattendance', authenticateToken, async (req, res) => {
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

    
          //DEPRECATA
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
        /* DEPRECATA */
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
    
            //DEPRECATA
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

//chiamate deprecate da usercalls

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
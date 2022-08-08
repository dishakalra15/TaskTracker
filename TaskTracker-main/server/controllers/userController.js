const mysql = require('mysql');
var request = require('request');

var quote = 'a';
// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

function validateAuth(req) {
  console.log("REQ URL: "+ req.url);
  console.log("UserId from URL : " + req.params.id);
  let requestedUserId = req.params.id;
  let loggedInUserId = req.cookies['authCookie'];
  console.log('URL id is: '+req.params.id+" CookieId is: "+req.cookies['authCookie']);
  if(typeof req.url == 'undefined' ){
    return true;
  }
  return (requestedUserId == loggedInUserId);
} 

exports.logout = (req,res) => {
  // Delete cookie
  res.clearCookie("authCookie");
  console.log("Logging out...");
  res.render('login');
}

// Sign up page
exports.signup = (req,res) => {
  // if (!validateAuth(req)) {
  //   res.redirect("/logout");
  // }
    res.render('signup');
}

exports.signin = (req,res) => {
  // if (!validateAuth(req)) {
  //   res.redirect("/logout");
  // }
    res.render('login');
}

exports.createUser = (req,res) => {
  // if (!validateAuth(req)) {
  //   res.redirect("/logout");
  // }
  try {
    
    const { first_name, last_name, email, manager_email, password } = req.body;
    connection.query('SELECT * FROM users where email = ?',[email], (err,rows) => {
      if(rows.length>0){
          var resp = {
          valid: 0
        }
        return res.json(resp);
      }else{
        connection.query('INSERT INTO users SET first_name = ?, last_name = ?, email = ?, manager_email = ?, password = ?', [first_name, last_name, email, manager_email, password], (err, rows) => {
                if (!err) {
                  res.render('login');
                } else {
                  console.log(err);
                }
                console.log('The data from user table: \n', rows);
              });
              var resp = {
                valid: 1
              }
              return res.json(resp);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

exports.validate = (req,res) => {
  // if (!validateAuth(req)) {
  //   res.redirect("/logout");
  // }
    const { username, pass } = req.body;
    console.log(req.body);
    try {      
    let sq = ''; 
    // let q = 'SELECT * FROM users WHERE email = '+username+' AND password = '+pass;
    // console.log(q);
    let q = 'SELECT id FROM users WHERE email = ? AND password = "'+pass+'"';
    console.log(q);
    connection.query( q, [username], (err, rows) => {
      // console.log("Rows are: "+rows);
      if(rows.length > 0){
        console.log(rows);
        console.log('User id: '+rows[0].id);
        var uid = rows[0].id;
        res.cookie('authCookie',rows[0].id, { maxAge: 900000, httpOnly: true });
        connection.query('SELECT * FROM users WHERE manager_email = ? ', [username], (err, rows2) => {
          if(rows2.length > 0){
            let obj ={
              valid: 1,
              manager: 1,
              id: uid
            }
            res.json(obj);
            // res.redirect(`${rows[0].id}`);
          }else{
            let obj ={
              valid: 1,
              manager: 0,
              id: uid
            }
            res.json(obj);
            // console.log("Here");
            // console.log(rows[0].id);
            // res.redirect(`${rows[0].id}/tasks`);
          }
        })            
      }else{
        let obj = {
          valid: 0
        }
        res.json(obj);
        // res.render('login'); // HTTP status code 400
      }
  });
    } catch (error) {
      console.log("Error: "+error);
      res.render('login'); // HTTP status code 400
    }
}
exports.viewTasks = (req,res) => {
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  res.render('employee');
}

exports.viewTasksOnly = (req,resp) =>{
  try {
    
  if (!validateAuth(req)) {
    resp.redirect("/logout");
  }
  console.log("ViewTasks: "+JSON.stringify(req.cookies));
  let name = '';
  connection.query('SELECT first_name FROM users WHERE id = ?', [req.params.id], (err, rows) => {
    if(rows.length>0){
    name = rows[0].first_name;}
});
    connection.query('SELECT * FROM task WHERE user_id = ? ORDER BY task_date DESC', [req.params.id], (err, rows) => {
    if (!err) {
      // if(rows.length === 0)
        request('https://api.quotable.io/random',(err,res,body)=>{
        // console.log(res.headers);
        if(!err && res.statusCode == 200){
          dates=[];
          // rows.forEach(element => {
          //   var cs = element.task_date.toString();
          //   cs = cs.substr(0,10);
          //   dates.append(cs);
          // });
          // console.log(dates);
          console.log(JSON.parse(body));
          quote = JSON.parse(body).content;
        //   console.log(quote);
        //   resp.render('employee', { rows,owner:{
        //   name: name,
        //   quote: quote,
        //   id: req.params.id
        // } });
        let obj = {
          rows: rows,
          name: name,
          quote: quote,
          id: req.params.id
        }
        return resp.json(obj);
        }
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
  } catch (error) {
    console.log(error);
  }
}

exports.createTask = (req,res) => {
  try {
    
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  console.log("createTasks "+req.cookies);
    var str = req.body.dt;
    var dt = str.slice(0,10);
    var d = req.body.description;
    console.log(req.body);
    let user_id = req.params.id;
    console.log(user_id);
    connection.query('SELECT * FROM task WHERE task_date = ? AND user_id = ?',[dt,user_id],(err,rows) => {
        if(!err){
            if(rows.length>0){
                 d += " \n" + rows[0].description;
                connection.query('UPDATE task SET description = ? WHERE task_date = ? AND user_id = ?', [d,dt,user_id], (err, rows) => {
                    if (!err) {
                        let cid = req.params.id;
                        console.log(cid);
                        res.redirect(`tasks`);
                    } else {
                      console.log(err);
                    }
                    console.log('The data from user table: \n', rows);
                  });
            }else{
                connection.query('INSERT INTO task SET task_date = ?, description = ?, user_id = ?', [dt, d,user_id], (err, rows) => {
                    if (!err) {
                        let cid = req.params.id;
                        console.log(cid);
                        res.redirect(`tasks`);
                    } else {
                      console.log(err);
                    }
                    console.log('The data from user table: \n', rows);
                  });
            }
        }else{
            console.log(err);
        }
    });
  } catch (error) {
    console.log(error);
  }

}

exports.edit = (req,res) => {
  try {
   
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  console.log("edit: "+req.cookies);
    connection.query('SELECT * FROM task WHERE id = ?', [req.params.tid], (err, rows) => {
        if (!err) {
            console.log(req.params.tid);
          res.render('edit', { rows });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      }); 
  } catch (error) {
    console.log(error);
  }
}

exports.update = (req,res) => {
  try {
   
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
    let description = req.body.description;
    console.log("We reached");
    console.log(req.body.description);
    connection.query('UPDATE task SET description = ? WHERE id = ?', [description, req.params.tid], (err, rows) => {

            if (!err) {
                console.log("Updatedddd");

              // User the connection
                connection.query('SELECT * FROM task WHERE id = ?', [req.params.tid], (err, rows) => {
                // When done with the connection, release it
                
                if (!err) {
                  res.redirect('../tasks');
                  // res.render('employee', rows);
                } else {
                  console.log(err);
                }
                console.log('The data from user table: \n', rows);
              }
              );
            } 
            else {
              console.log(err);
            }
        }) 
  } catch (error) {
    console.log(error);
  }
}

exports.managerHome = (req,res) => {
  try {
   
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  let id = req.params.id;
  var name = 'a';
  connection.query('SELECT * FROM users WHERE id = ?',[id],(err,rows) => {
    console.log("ROWS: "+rows);
    name = rows[0].first_name;
    res.render('manager-home',{owner:{
      id:id,
      name:name
    }});
  }) 
  } catch (error) {
    console.log(error);
  }
}

exports.teamTasks = (req,res) => {
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  res.render('tables');
}

exports.viewrestTasks = (req,res) =>{
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  let task = {
    id: 21,
    description: "some task"
  };
  res.json(task);
}

exports.teamandtasks = (req,res) => {
  try {
   
  if (!validateAuth(req)) {
    res.redirect("/logout");
  }
  var em = 'a';
  connection.query('SELECT * FROM users WHERE id = ?',[req.params.id], (err, rows) => {
    if(rows.length>0){
      em = rows[0].email;
      console.log("Controller " + req.query.start+" "+ req.query.end);
      let query = 'SELECT u.first_name, u.email, t.task_date, t.description FROM users u JOIN task t ON (u.id = t.user_id) WHERE u.manager_email = ? AND t.task_date >= ? AND t.task_date <= ? ORDER BY t.task_date';
      // let query = 'SELECT u.first_name, u.email, t.task_date, t.description FROM users u JOIN task t ON (u.id = t.user_id) WHERE u.manager_email = ? AND t.task_date >= ? AND t.task_date <= "' ;
      // let query2 = '" ORDER BY t.task_date;';
      // query = query + req.query.end + query2;
      // console.log("query: "+query);
      connection.query(query ,[em,req.query.start,req.query.end], (err, rows) => {
      res.json(rows);// first name, email , tasks_date, and desc.
    });   
  }
}); 
  } catch (error) {
    console.log(error);
  }

}
// end = end + '";select * from users u join task t ON (u.id = t.user_id) WHERE u.first_name like \"%"
// exports.check = (req,res) => {
//   if (!validateAuth(req)) {
//     res.redirect("/logout");
//   }
//   connection.query('SELECT * FROM users WHERE email = ? AND password = ?',[req.query.username,req.query.pass], (err, rows) => {
//     if(rows.length>0){
//       let temp = {
//         validation: 1
//       }
//       res.json(temp);
//     }else{
//       let temp = {
//         validation: 0
//       }
//       res.json(temp);
//     }
// });
     
//   }


// View Users
// exports.view = (req, res) => {
//   // User the connection
//   connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
//     // When done with the connection, release it
//     if (!err) {
//       let removedUser = req.query.removed;
//       res.render('home', { rows, removedUser });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }

// // Find User by Search
// exports.find = (req, res) => {
//   let searchTerm = req.body.search;
//   // User the connection
//   connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
//     if (!err) {
//       res.render('home', { rows });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }

// exports.form = (req, res) => {
//   res.render('add-user');
// }

// // Add new user
// exports.create = (req, res) => {
//   const { first_name, last_name, email, phone, comments } = req.body;
//   let searchTerm = req.body.search;

//   // User the connection
//   connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => {
//     if (!err) {
//       res.render('add-user', { alert: 'User added successfully.' });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }


// // Edit user
// exports.edit = (req, res) => {
//   // User the connection
//   connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//     if (!err) {
//       res.render('edit-user', { rows });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }


// // Update User
// exports.update = (req, res) => {
//   const { first_name, last_name, email, phone, comments } = req.body;
//   // User the connection
//   connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {

//     if (!err) {
//       // User the connection
//       connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//         // When done with the connection, release it
        
//         if (!err) {
//           res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
//         } else {
//           console.log(err);
//         }
//         console.log('The data from user table: \n', rows);
//       });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// }

// // Delete User
// exports.delete = (req, res) => {

//   // Delete a record

//   // User the connection
//   // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

//   //   if(!err) {
//   //     res.redirect('/');
//   //   } else {
//   //     console.log(err);
//   //   }
//   //   console.log('The data from user table: \n', rows);

//   // });

//   // Hide a record

//   connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//     if (!err) {
//       let removedUser = encodeURIComponent('User successeflly removed.');
//       res.redirect('/?removed=' + removedUser);
//     } else {
//       console.log(err);
//     }
//     console.log('The data from beer table are: \n', rows);
//   });

// }

// // View Users
// exports.viewall = (req, res) => {

//   // User the connection
//   connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
//     if (!err) {
//       res.render('view-user', { rows });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });

// }
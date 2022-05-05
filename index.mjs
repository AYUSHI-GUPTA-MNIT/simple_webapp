import express from 'express';
const app = express()
import {  isNewSessionRequired, generateJWTToken, verifyToken } from './authUtils.mjs';
app.use(express.json());
// app.use((req, res, next) => {
//     console.log(req);
//     app.use(express.json());
    
//   });
app.get('/hello', function (req, res) {
  res.send('Hello World')
})
app.get('/me/:id', function (req, res) {
    const param=req.params.id;
    console.log(param);
    res.send(`${param}`)
  })
  app.get('/me', function (req, res) {
    const param=req.query.name;
    console.log(param);
    res.send(`Hello ${param}`)
  })
  app.post('/hello', function (req, res) {
    res.send('Hello World')
  })
  
  
  
  
  const allUsersData = [{username:'1',password:'12345'}];

  app.post("/login",(req,res,next)=>{
    console.log('body',req.body);
    const userData = {};
    req.session = {};
    const errors = {};
    var apiUrl = req.url;
  var httpMethod = req.method;
    ['username', 'password'].forEach(key => {
        if (req.body[key] === null || req.body[key] === undefined) {
            errors[key] = `${key} is required parameter`;
        }
        else if (req.body[key] === "") {
            errors[key] = `${key} can't be empty`;
        }
        else {
            userData[key] = req.body[key];
        }
    });
    
    

    if (Object.keys(errors).length > 0) {
        res.status(400).json(errors);
        return;
    }

    // Check whether the mentioned username and password exists in our list of registered users
    let isValid = false;
    let requestedUserIndexInGlobalArray = -1;

    for (let i = 0; i < allUsersData.length; i++) {
        const alreadyExistingUser = allUsersData[i];

        if (alreadyExistingUser.username === userData.username && alreadyExistingUser.password === userData.password) {
            isValid = true;
            requestedUserIndexInGlobalArray = i;
            break;
        } 
    }

    if (!isValid) {
        res.status(401).json({ message: "Invalid username or password!" });
    }
    else {
        
        if (isNewSessionRequired(httpMethod, apiUrl)) {
            req.newSessionRequired = true;
            console.log('enter');
            let authHeader = req.header('Authorization');
            let sessionID = authHeader.split(' ')[1];
            console.log('ses',sessionID);
            res.setHeader('auth-token',generateJWTToken(userData));
            res.json({ message: "Successfully found!" });
        //     if (sessionID) {
        //         let userData = verifyToken(sessionID);
        //         if (userData) {
        //           req.session.userData = userData;
        //           req.session.sessionID = sessionID;
        //         }
        //     try{
        //         res.setHeader('auth-token',
        //   generateJWTToken(userData));
               
        //       }catch(e){
        //         console.log('e1:',e);
        //       }
        //   } 
        }

    }
    next();

  });
  
  app.post("/register", (req, res) => {
      const userData = {};
  
      const errors = {};
      ['username', 'password', 'name', 'year-of-graduation', 'college'].forEach(key => {
          if (req.body[key] === null || req.body[key] === undefined) {
              errors[key] = `${key} is required parameter`;
          }
          else if (req.body[key] === "") {
              errors[key] = `${key} can't be empty`;
          }
          else {
              userData[key] = req.body[key];
          }
      });
  
      if (Object.keys(errors).length > 0) {
          res.status(400).json(errors);
          return;
      }
  
      let usernameAlreadyTaken = false;
      allUsersData.forEach(alreadyExistingUser => {
          if (alreadyExistingUser.username === userData.username) usernameAlreadyTaken = true;
      });
  
      if (usernameAlreadyTaken) {
          res.status(400).json({ message: "username already taken!" });
          return;
      }
  
      allUsersData.push(userData);
  
      res.json({ message: "Successfully registered!" });
  });
  
  app.get("/profiles", (req, res) => {
      const usersDataCopy = JSON.parse(JSON.stringify(allUsersData));
      
      usersDataCopy.forEach(user => {
          delete usersDataCopy['password'];
      });
  
      res.json(usersDataCopy);
  });
  
  app.put("/profile", (req, res) => {
      const userData = {};
  
      const errors = {};
      ['username', 'password', 'name', 'year-of-graduation', 'college'].forEach(key => {
          if (req.body[key] === null || req.body[key] === undefined) {
              errors[key] = `${key} is required parameter`;
          }
          else if (req.body[key] === "") {
              errors[key] = `${key} can't be empty`;
          }
          else {
              userData[key] = req.body[key];
          }
      });
  
      if (Object.keys(errors).length > 0) {
          res.status(400).json(errors);
          return;
      }
  
      // Check whether the mentioned username and password exists in our list of registered users
      let isValid = false;
      let requestedUserIndexInGlobalArray = -1;
  
      for (let i = 0; i < allUsersData.length; i++) {
          const alreadyExistingUser = allUsersData[i];
  
          if (alreadyExistingUser.username === userData.username && alreadyExistingUser.password === userData.password) {
              isValid = true;
              requestedUserIndexInGlobalArray = i;
              break;
          } 
      }
  
      if (!isValid) {
          res.status(401).json({ message: "Invalid username or password!" });
      }
      else {
          // update the user's details corresponding to the found user
          allUsersData[requestedUserIndexInGlobalArray] = userData;
          res.json({ message: "Successfully updated!" });
      }
  });
  
  app.listen(7050, () => console.log("Listening on port 7050..."));

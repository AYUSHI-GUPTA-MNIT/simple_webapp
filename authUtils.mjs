import jwt from 'jsonwebtoken';
const newSessionRoutes = [{ path: '/login', method: 'POST' }];

const SECRET_KEY = "JWT_SECRET";

 export const isNewSessionRequired = (httpMethod, url) => {
 
    for (let routeObj of newSessionRoutes) {
      if (routeObj.method === httpMethod && routeObj.path === url) {
        return true;
      }
    }
  return false;
  }
 
 export const generateJWTToken = (userData) =>{
   console.log('user',userData)
   console.log('token',jwt.sign(userData, SECRET_KEY))
     return jwt.sign(userData, SECRET_KEY);
  }
 export const verifyToken = (jwtToken) =>{
     try{
        return jwt.verify(jwtToken, SECRET_KEY);
     }catch(e){
        console.log('e:',e);
        return null;
     }
  }
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api' ,(req,res) => {
  res.json({
    message: 'welcome to the api'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'mysecretkey',(err, authData) => {
    if(err){
      res.sendStatus(403);
    }else{
      res.json({
        message: 'post created',
        authData
      });
    }
  })
});

app.post('/api/login', (req, res) => {
  //sample user - usually you would send your username and pwd and authentication to get user from DB
  const user = {
    id: 1,
    username: 'pragya',
    email: 'pragyaemail@teamail.com'
  };
  //the 3rd parameter is optional. mention all the parameters that you want to send
  jwt.sign({user: user}, 'mysecretkey', {expiresIn: '30s'}, (err, token) => {
    res.json({
      token: token
    });
  });
});



//middleware function verifyToken
function verifyToken(req, res, next){
  //get auth header value
  //Format of verifyToken
  //Authodization: Bearer <access_token>. Bearer word will have to be removed
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader != 'undefined' ){
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    console.log(token);
    next();
  }else{
    //forbidden
    res.sendStatus(403);
  }

}

app.listen(5000, () => {
  console.log("app listening on 5000");
});

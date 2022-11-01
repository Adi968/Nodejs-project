require("dotenv").config();
const { response } = require("express");
const userRouter = require("./api/users/user.router");
const AppError = require("./utils/AppError");
const express = require("express");
const app = express();
const useragent = require('express-useragent');



app.use(useragent.express());

app.use(express.json());
app.all("*",(request,response,next)=>{
  request.useragent.source=request.useragent.source;
  console.log("request.useragent.source 1:"+request.useragent.source);
 //err.status=404;
 next();
});
app.use("/api/users", userRouter);



app.get('/', function(req, res){
  console.log(req.useragent.source);
  res.send(req.useragent.source);
});

app.all("*",(request,response,next)=>{
  const err=new AppError(`Requested URL ${request.path} not found`,404);
  //err.status=404;

  next(err);
});

app.use((error,request,response,next)=>{
           const statusCode=error.status||503;
           response.status(statusCode).json({
            success:0,
            message:error.message
           // ,stack:error.stack  
           });          
});



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});


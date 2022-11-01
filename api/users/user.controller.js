const {registerUser,getUsers,checkIfRegister,
  createUserSession,getAllUserSessions,
  deleteAllUserSessions,addUserPowerUsageDetails,
  getAllPowerUsage,getAllPowerUsageByDay} = require("./user.service");

const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res,next) => {
    try{
         const body = req.body;
        registerUser(body, (err, results) => {
        if (err) 
        {
           console.log(err);
           next(err);
        }
        else
        { return res.status(200).json({success: 1,data: results}); }
      });
     }
     catch(error) {  next(error); }
  },


  login: (req, res,next) => {
    try{
      checkIfRegister(req.body,(err, results) => {
         if (err) 
         {
           console.log(err);
           next(err);
         }
         else
         {
           const jsontoken = sign({ result: results }, process.env.JWT_KEY, {expiresIn: "5m"});
      
        
             createUserSession(results.UUID,req.useragent.source,jsontoken,(err, results)=>{
                       if(err) 
                       {
                        console.log(err);
                        next(err);
                       }
                       else
                       {
                        console.log("user session is created successfully");
                       }
             });    
           return res.json({success: 1,message: "login successfully",token: jsontoken});
         }       
  });
}
catch(error){  next(error); }
  },

  getAllUser: (req, res,next) => {
    try{
         getUsers((err, results) => {
            if (err) 
            {
              console.log(err);
              next(err);
            }
            else
            {
              return res.status(200).json({success: 1,data: results});
            }
    });
  }
  catch(error){  next(error); }
  },
  getAllUserActiveSessions: (req, res,next) => {
      try{
        getAllUserSessions(req.params.id,(err, results) => {
            if (err) 
            {
              console.log(err);
              next(err);
            }
            else
            {
              return res.status(200).json({success: 1,data: results});
            }
       });
     }
      catch(error){  next(error); }
  },

  logout: (req, res,next) => {
    try{
    deleteAllUserSessions(req.params.id,(err, results) => {
          if (err) 
          {
            console.log(err);
            next(err);
          }
          else
          {
            console.log("All user session are remove");
            return res.status(200).json({success: 1,message: "logout is done successfully"});
          }
     });
   }
    catch(error){  next(error); }
},
creatUserPowerUsage: (req, res,next) => {
  try{
  addUserPowerUsageDetails(req.body,req.params.id,(err, results) => {
        if (err) 
        {
          console.log(err);
          next(err);
        }
        else
        {
          return res.status(200).json({success: 1,data: results});
        }
   });
 }
  catch(error){  next(error); }
},   
listPowerUsage: (req, res,next) => {
    try{
        getAllPowerUsage(req.body,req.params.id,(err, results) => {
         if (err) 
         {
            console.log(err);
            next(err);
         }
         else
         { 
          return res.status(200).json({success: 1,data: results});
        }
      });
    }
    catch(error){  next(error); }
  },

  listPowerUsageDayWise: (req, res,next) => {
    try{
        getAllPowerUsageByDay(req.params.id,(err, results) => {
         if (err) 
         {
            console.log(err);
            next(err);
         }
         else
         { 
          return res.status(200).json({success: 1,data: results});
        }
      });
    }
    catch(error){  next(error); }
  }
};
  
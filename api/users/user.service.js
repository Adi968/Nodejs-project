const pool = require("../../config/database");
const AppError=require("../../utils/AppError");
module.exports={
   registerUser:(data,callBack)=>{
      const UUID=data.UserName.substring(0,1)+Math.random()
      data.EmailId.substring(0,2)+Math.random()
      data.MobileNumber.substring(0,3);
      let userData=[data.DisplayName,data.UserName,data.EmailId,data.MobileNumber,data.Password,
      UUID];

      let queryStrCheckIfUserExists=`select * from users where DisplayName=? and UserName=?
                                    and EmailId=? and MobileNumber=?`;
    pool.query(queryStrCheckIfUserExists,userData,(error,results,fields)=>{
         if(error)
         {
          callBack(error,null);
         }
         else
         {  
            const ifUserExists=results.length>0||false;
            if(ifUserExists)
            {
               const error=new AppError("User already exists use different details for registration or try signup",403);
               callBack(error,null);
            } 
            else
            {
              let queryStr=`insert into users(DisplayName,UserName,EmailId,MobileNumber,Password,UUID) 
              values(?,?,?,?,?,?);`;
            
                pool.query(queryStr,userData,(error,results,fields)=>{
                     if(error)
                     {
                      if(error.message.includes('ER_DUP_ENTRY'))
                      { 
                        const strArr=error.message.split(" ");
                        const errStr=`${strArr[strArr.length-1]} is already used please try with different value`;
                        error=new AppError(errStr,409);
                      }
                         callBack(error,null);
                     }
                     else
                     {  
                      return callBack(null,results);
                     }
                    }
               
                );
            } 
         }
    });
    },

   getUsers: callBack => {
    console.log("getUsers method called");
    let queryStr=`select * from users`;
    pool.query(queryStr,[],
      (error, results, fields) => {
        if (error) {callBack(error,null);}
        else if(results.length==0)
        {
          const error=new AppError("No record present for the given data",404);
          callBack(error,results);
        }
        else {callBack(null, results);}
      }
    );
    },
    checkIfRegister: (data,callBack) => {
      console.log("checkIfRegister method called");
      let queryStr=`select * from users where UserName=? or MobileNumber=? or EmailId=?`;
      pool.query(queryStr,[data.loginId,data.loginId,data.loginId],
        (error, results, fields) => {
          if (error) {
            callBack(error,null);
          }
          else if(results.length==0)
          {
            callBack(new AppError("Please use valid Login Id use MobileNumber or UserName or EmailId)",403),null);
          }
          else
          {
            const isValidPassword=data.password==results[0].Password;
            if(isValidPassword)
            {
              return callBack(null, results[0]);            
            }
            else
            {
              callBack(new AppError("Please use valid Password)",403),null);
            }
          }
        }
      );
      },
    createUserSession:(UUID,appName,token,callBack)=>{
        console.log("createUserSession method called");
        let queryStr=`insert into user_session(UUID,login_date,app_name,jwttoken) values(?,?,?,?)`;
        let userSessionData=[UUID,new Date(),appName,token];
        pool.query(queryStr,userSessionData,
          (error, results, fields) => {
            if (error) { callBack(error,null);}
            else
            {
              console.log("user_session is created successfully");
              return callBack(null, results);
            }
          }
        );
      },
      getAllUserSessions:(UUID,callBack)=>
      {
        console.log("getAllUserSessions method called");
        let queryStr=`select login_date,app_name from user_session where UUID=?`;
        pool.query(queryStr,[UUID],
          (error, results, fields) => {
            if (error) {callBack(error,null);}
            else if(results.length==0)
            {
              const error=new AppError("No record present for the given data",404);
              callBack(error,results);
            }
            else {callBack(null, results);}
          }
        );
      },
      deleteAllUserSessions: (data, callBack) => {
        console.log("deleteAllUserSessions method called");
        pool.query(
          `delete from user_session where UUID=?`,
          [data],
          (error, results, fields) => {
            if (error) {callBack(error,results);}
            else {callBack(null, results);}
          }
        );
      },
      
      addUserPowerUsageDetails: (data,UUID,callBack) => {
        console.log("addUserPowerUsageDetails method called");

        pool.query(`insert into power_usage(UUID,fromTime,toTime,duration,unitConsumed,
          appliance) values(?,?,?,?,?,?);`,
          [UUID,new Date(data.fromTime),new Date(data.toTime),
            data.duration,data.unitsConsumed,data.applianceType],
          (error, results, fields) => {
            if (error) {callBack(error,results);}
            else{callBack(null, results);}
          }
        );
      },
      
        getAllPowerUsage:(data,UUID,callBack)=>
        {
          console.log("getAllPowerUsage method called");
          let queryStr= `select fromTime,toTime,duration,unitConsumed,appliance
          from power_usage where 
          fromTime>=? and toTime<=?
          and UUID=?`;
          const userData=[data.fromTime,data.toTime,UUID];
          pool.query(queryStr,userData,
            (error, results, fields) => {
              if (error)
               {callBack(error,null);}
              else if(results.length==0)
              {
                const error=new AppError("No record present for the given data",404);
                callBack(error,results);
              }
              else {callBack(null, results);}
            }
          );
        },

      getAllPowerUsageByDay:(UUID,callBack)=>
      {
        console.log("getAllPowerUsageByDay method called");
        let queryStr=`select Date(fromTime) as 
        day_wise,sum(duration) as total_duration,sum(unitConsumed) 
        as total_units_consumed 
        from power_usage where UUID=? 
        group by Date(fromTime)`;
        pool.query(queryStr,[UUID],
          (error, results, fields) => {
            if (error) 
            {  
              callBack(error,null);
            }
            else if(results.length==0)
            {
              const error=new AppError("No record present for the given data",404);
              callBack(error,results);
            }
            else {callBack(null, results);}
          }
        );
      },

      ifTokenExists:(token)=>{
        console.log("ifTokenExists method called");
        let queryStr=`select login_date,app_name from user_session where jwttoken=?`;
        pool.query(queryStr,[token],
          (error, results, fields) => {
            if (error) {
              return false;}
            else if(results.length==0)
            {
              return false;
            }
            else{ 
              return true;}
          }
        );
      }

    }

  





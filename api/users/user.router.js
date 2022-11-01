const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {createUser,getAllUser,login,
    getAllUserActiveSessions,logout,
    creatUserPowerUsage,listPowerUsage,
    listPowerUsageDayWise}= require("./user.controller");

//router.get("/", checkToken, getUsers);
router.post("/register/", createUser);
router.post("/login",login);
router.get("/getAllUser",checkToken,getAllUser);
router.get("/getAllUserSessions/:id",checkToken,getAllUserActiveSessions);
router.get("/logout/:id",checkToken,logout);
router.post("/addUserPowerUsage/:id",checkToken,creatUserPowerUsage);
router.get("/getUserPowerUsage/:id",checkToken,listPowerUsage);
router.get("/getUserPowerUsageByDate/:id",checkToken,listPowerUsageDayWise);
module.exports = router;

const express = require("express");
const route = express();
const { login, register,coba,logout, me,registerAdmin,petugasonly,verify } = require("../controllers/auth");

route.post("/register", register);
route.post("/register/petugas", registerAdmin);
route.post("/login", login);
route.delete("/logout",logout );
route.get("/pet", petugasonly);
route.get("/ps", verify);
route.get("/me", me);
route.get("/coba", coba)


module.exports = route;

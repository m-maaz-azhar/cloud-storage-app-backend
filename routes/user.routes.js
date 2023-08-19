
const { loginUser, registerUser } = require("../controllers/user.controller");

module.exports = function (app) {
    app.route("/user/login").post(loginUser);
    app.route("/user/register").post(registerUser);
}
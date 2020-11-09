const router = require("express-promise-router")();
const userController = require("../controllers/users.js");
router.route("/register").post(userController.registerCA);
module.exports = router;

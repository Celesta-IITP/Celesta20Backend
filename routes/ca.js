const router = require("express-promise-router")();
const caController = require("../controllers/ca.js");
router.route("/register").post(caController.registerCA);
module.exports = router;

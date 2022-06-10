const express = require("express")

const authController = require("../controllers/authController")

const router = express.Router()

router.route("/")
    .get(authController.getAllUsers)

router.route("/signup")
    .post(authController.createUser)

router.route("/login")
    .post(authController.loginUser)

router.route("/:id")
    .get(authController.getOneUser)
    .patch(authController.updateUser)
    .delete(authController.deleteUser)

module.exports = router
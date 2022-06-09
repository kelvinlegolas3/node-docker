const express = require("express")

const authController = require("../controllers/authController")

const router = express.Router()

router.route("/")
    .get(authController.getAllUsers)
    .post(authController.createUser)

router.route("/:id")
    .get(authController.getOneUser)
    .patch(authController.updateUser)
    .delete(authController.deleteUser)

module.exports = router
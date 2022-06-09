const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req, res) => 
{
    const username = "kevin"
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("test", salt)

    try
    {
        const newUser = await User.create(
        {
            username,
            password: hashPassword
        })

        res.status(201).json(
        {
            status: "success",
            data:
            {
                user: newUser
            }
        })
    }

    catch(e)
    {
        console.log(e)
        res.status(400).json(
        {
            status: "fail"
        })
    }
}
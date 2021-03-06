const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.getAllUsers = async (req, res, next) => 
{
    try
    {
        const users = await User.find()

        res.status(200).json(
        {
            status: "success",
            results: users.length,
            data:
            {
                users
            }
        })
    }

    catch (e)
    {
        res.status(400).json(
        {
            status: "fail",
        })
    }
}

exports.getOneUser = async (req, res, next) => 
{
    try
    {
        const user = await User.findById(req.params.id)

        res.status(200).json(
        {
            status: "success",
            results: user.length,
            data:
            {
                user
            }
        })
    }

    catch (e)
    {
        res.status(400).json(
        {
            status: "fail",
        })
    }
}

exports.createUser = async (req, res) => 
{
    const {username, password} = req.body
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)

    try
    {
        const newUser = await User.create(
        {
            username: username,
            password: hashPassword
        })

        req.session.user = newUser

        res.status(200).json(
        {
            status: "success",
            data:
            {
                newUser
            }
        })
    }

    catch(e)
    {
        res.status(400).json(
        {
            status: "fail"
        })
    }
}

exports.updateUser = async (req, res, next) => 
{
    try
    {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, 
        {
            new: true,
            runValidators: true
        })

        res.status(200).json(
        {
            status: "success",
            data:
            {
                user
            }
        })
    }

    catch (e)
    {
        res.status(400).json(
        {
            status: "fail",
        })
    }
}

exports.deleteUser = async (req, res, next) => 
{
    try
    {
        const user = await User.findByIdAndDelete(req.params.id)

        res.status(200).json(
        {
            status: "success",
            data:
            {
                user
            }
        })
    }

    catch (e)
    {
        res.status(400).json(
        {
            status: "fail",
        })
    }
}

exports.loginUser = async (req, res) => 
{
    const {username, password} = req.body
    
    try
    {
        const user = await User.findOne({username})

        if (!user)
        {
            res.status(404).json(
            {
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect)
        {
            req.session.user = user
            res.status(200).json(
            {
                status: "success"
            })
        }

        else
        {
            res.status(400).json(
            {
                status: "fail",
                message: "incorrect username or password"
            })
        }
    }

    catch (e)
    {
        res.status(
        {
            status: "fail"
        })
    }
}
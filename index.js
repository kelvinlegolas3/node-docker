const express = require("express")
const mongoose = require("mongoose")

const app = express()
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const postRouter = require("./routers/postRouter")
const userRouter = require("./routers/userRouter")

const port = process.env.PORT || 3000

const connectWithRetry = () =>
{
    mongoose.connect(mongoURL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => 
    {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

app.use(express.json())

app.get("/", (req, res) => 
{
    res.send("<h2>This is Kevin</h2>")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => console.log(`listening on port ${port}`))

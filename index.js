const express = require("express")
const mongoose = require('mongoose')

const app = express()
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

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

const postRouter = require("./routes/postRoute")
app.use("/api/v1/posts", postRouter)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))

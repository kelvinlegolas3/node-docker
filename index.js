const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const app = express()
const redis = require("redis")
const cors = require("cors")
let RedisStore = require("connect-redis")(session)

const 
{ 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT, 
    SESSION_SECRET, 
    REDIS_URL,
    REDIS_PORT
} = require("./config/config")

let redisClient = redis.createClient(
{
    host: REDIS_URL,
    port: REDIS_PORT
})    

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

app.enable("trust proxy") //trust the headers nginx proxy is going to be adding to the request (ex. originating sender's IP address)
app.use(cors({}))
app.use(session(
{
    store: new RedisStore(
    {
        client: redisClient
    }),
    secret: SESSION_SECRET,
    cookie:
    {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000
    }
}))

app.use(express.json())

app.get("/api/v1", (req, res) => 
{
    res.send("<h2>This is Kevin</h2>")
    //console.log("Load balancing...")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => console.log(`listening on port ${port}`))

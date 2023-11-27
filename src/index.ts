// to start the project begin with | npm init -y
// install typescript on dev dependencies | npm install -D typescript
// install ts-node on dev dependencies | npm install -D ts-node
// install nodemon to keep the server running on live | npm install -D nodemon
// install express, bodyParser, cookieParser, compression, cors | npm i express body-parser cookie-parser compression cors
// install all their types | npm i -D @types/express @types/body-parser @types/cookie-parser @types/compression @types/cors
// install mongodb | npm install mongodb
// install mongoose | npm install mongoose
// install mongoose types on dev dependencies | npm i -D @types/mongoose
// install lodash | npm i lodash
// install lodash types | npm i -D @types/lodash

import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose, { Connection } from 'mongoose'
import router from './router/index'

const port = 8080
const app = express()
const MONGO_URL = "mongodb+srv://caiogsan:12062002djdaD@cluster0.lioqca7.mongodb.net/?retryWrites=true&w=majority"

app.use(cors({
    credentials: true
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(port, () => {
    console.log(`server running on port http://localhost:${port}/`)
})

mongoose.Promise = Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => console.log(error))
mongoose.connection.on('connection', (connection: Connection) => console.log('conectado'))

app.use('/', router())


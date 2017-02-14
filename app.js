'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import memoryStore from './db/memoryStore.js'
// import session from 'express-session'
// import cookieParser from 'cookie-parser'
// morgan
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import rfs from 'rotating-file-stream'
import qcloud from 'qcloud-weapp-server-sdk'

// import mongo from 'connect-mongo'
import controller from './db/controller.js'
import config from './config.js'

const app = express()
// const connection = mongoose.createConnection(config.db)
// const MongoStore = mongo(session)

const logDirectory = path.join(__dirname, 'log')

qcloud.config = {
    // 业务服务器的主机名
    ServerHost: '',
    // 鉴权服务器地址
    AuthServerUrl: '',
    // 信道服务器地址
    TunnelServerUrl: '',
    // 和信道服务器通信的签名密钥
    TunnelSignatureKey: ''
}

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})

// 记录请求日志
app.use(morgan('tiny', {stream: accessLogStream}))

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * session 存储处理
 * 使用mongodb存储用户信息
 */
// app.use(cookieParser())
// app.use(session({
//     secret: 'celebrity',
//     store: new MongoStore({
//         url: config.db,
//         autoRemove: 'interval',
//         ttl: 60 * 60
//     }),
//     cookie: { maxAge: 60 * 1000 },
//     resave: true,
//     saveUninitialized: true
// }))

app.use('*', (req, res, next) => {
    console.log('sessionID', memoryStore.getAll())
    next()
})

app.get('/', (req, res) => {
    return res.send('ok')
})
// 微信登陆
app.post('/wxlogin', controller.wxlogin)

// 查询卡片信息
app.get('/findOneCard', controller.findOneCard)
// 新增卡片信息
app.post('/addCard', controller.addCard)

// 监听服务的运行
app.listen(config.port, () => {
    console.log('server start 5060')
})


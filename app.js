'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import mongo from 'connect-mongo'
import controller from './db/controller.js'
import config from './config.js'

const app = express()
// const connection = mongoose.createConnection(config.db)
const MongoStore = mongo(session)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * session 存储处理
 * 使用mongodb存储用户信息
 */
app.use(session({
    secret: 'celebrity',
    store: new MongoStore({
        url: config.db,
        autoRemove: 'interval',
        ttl: 14 * 24 * 60 * 60
    }),
    // cookie: { maxAge: 60 * 1000 },
    resave: true,
    saveUninitialized: true
}))

app.use('*', (req, res, next) => {
    console.log('sessionID', req)
    console.log('req.session.user', req.session.user)
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


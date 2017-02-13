'use strict'

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// 根据不同的环境变量加载不同的配置文件
// module.exports = require(`./${process.env.NODE_ENV}`)
const env = process.env.NODE_ENV
let config = {
    db: '',
    port: 5060,
    AppID: 'wx7841dc8c790fc3a5',
    AppSecret: 'd648f43eb71e5665f6d616aa59cd84bb'
}
if (env === 'product') {
    Object.assign(config, {
        db: 'mongodb://'
    })
} else {
    Object.assign(config, {
        db: 'mongodb://localhost:27017/celebrity_db'
    })
}

export default config

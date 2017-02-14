// 名片小程序后台逻辑
import Card from './cardmodel.js'
import UserModel from './usermodel.js'
import memorystore from './memoryStore.js'
import config from '../config.js'
import fetch from 'node-fetch'
import crypto from 'crypto'
import WXBizDataCrypt from '../utils/WXBizDataCrypt.js'
import Promise from 'Promise'

let response = {
    result: 0,
    body: {},
    errCode: 0,
    errMessage: ''
}
/**
 * [ 查询一个名片介绍 ]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     []
 */
exports.findOneCard = (req, res) => {
    const cardId = req.query.cardId
    return Card.findById(cardId).then(success => {
        Object.assign(response, { body: success })
        return res.json(response)
    }, error => console.log(error))
}
/**
 * [新增卡片]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.addCard = (req, res) => {
    const card = new Card({page: 'test1', name: 'qiushi'})
    return card.save().then(success => {
        Object.assign(response, { body: success })
        return res.json(response)
    }, error => console.log(error))
}
/**
 * [编辑卡片]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.eidtCard = (req, res) => {
    const opt = req.body
    return Card.update({id: 'asdf'}, { $set: opt })
        .then((succ) => console.log(succ), err => console.log(err))
}
/**
 * [微信快速登陆]
 * @param  {[type]} req [接受小程序微信登陆]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.wxlogin = (req, res) => {
    const code = req.body.code
    const wxUserInfo = JSON.parse(req.body.wxUserInfo)
    let accesstoken = ''
    /**
     * [请求微信服务]
     */
    return fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.AppID}&secret=${config.AppSecret}&js_code=${code}&grant_type=authorization_code`)
        .then(data => {
            return data.json()
        }, error => console.log(error))
        /**
         * [签名解密微信用户信息]
         */
        .then(data => {
            console.log('签名解密微信用户信息')
            const pc = new WXBizDataCrypt(config.AppID, data.session_key)
            const userInfo = pc.decryptData(wxUserInfo.encryptedData, wxUserInfo.iv)
            accesstoken = crypto.createHmac('md5', 'secret').update(data.openid + data.session_key).digest('hex')
            memorystore.addOrUpdate(accesstoken, userInfo)
            return [Object.assign({}, { openId: data.openid }, userInfo), accesstoken]
        })
        // 用户
        .then(([userInfo, accesstoken]) => {
            if (userInfo) {
                return findOrSave(userInfo)
            }
            return Promise.reject({ error: '获取用户细信息错误' })
        })
        .then(userInfo => {
            console.log('登陆成功写入session', userInfo)
            Object.assign(response, { body: userInfo, accesstoken })
            return res.json(response)
        }, err => {
            console.log('登陆失败', err)
            Object.assign(response, { errCode: 1, errMessage: err.error })
            return res.json(response)
        })

}

/**
 * [findOrSave 查找用户信息如果对应的openid 则返回对应的用户信息 如果没有则新插入用户信息]
 * @param  {[type]} userInfo [description]
 * @return {[promise]} [description]
 */
function findOrSave (userInfo) {
    return UserModel.findOne({openId: userInfo.openId})
        .then(user => {
            if (user) {
                return { type: 'find', user}
            }
            const addUser = new UserModel(userInfo)
            return addUser.save().then(succ => {
                console.log('save is ok', succ)
                return { type: 'save', user: userInfo }
            })
        })
        .then(success => {
            return Promise.resolve(success.user)
        })
        .catch(err => {
            return Promise.reject(err)
        })
}


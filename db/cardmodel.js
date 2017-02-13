/**
 *  数据库的模型
 */
'use strict'

import mongoose from './dbconnect.js'

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

/**
 * [cardSchema 名片数据模型]
 * @type {Schema}
 * page 卡片标题
 * imgUrls 个人轮播图
 * desc 描述
 * info 个人信息
 * tag  标签
 * love 爱好
 * answer 问答
 */
const cardSchema = new Schema({
    page: { type: String },
    imgUrls: { type: Array },
    name: { type: String },
    sex: { type: Boolean },
    birthday: { type: String },
    xing: { type: String, default: '白羊座' },
    desc: { type: String },
    info: { type: Array },
    tag: { type: Array },
    love: { type: Array },
    answer: { type: Array }
}, {
    collection: 'card',
    timestamps: true
})

/**
 * [查找]
 * @param  {[type]}   id [description]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */

cardSchema.statics.findById = (id) => {
    return mongoose.model('card').findOne({ _id: id })
}
/**
 * [删除]
 * @param  {[type]} id [description]
 * @return {[promise]}    [description]
 */
cardSchema.statics.deleteById = (id) => {
    return this.remove({ id: new ObjectId(id) })
}
/**
 * [修改数据]
 * @param  {[type]} id  [卡片id]
 * @param  {[type]} opt [description]
 * @return {[promise]}   [description]
 */
cardSchema.statics.updataById = (id, opt) => {
    return this.update({ id: new ObjectId(id)}, { $set: opt })
}

const cardModel = mongoose.model('card', cardSchema)

export default cardModel


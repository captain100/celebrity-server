'use strict'

import mongoose from './dbconnect.js'

const Schema = mongoose.Schema

const userSchema = new Schema({
    nickName: { type: String },
    openId: { type: String },
    language: { type: String },
    gender: {type: Number },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    avatarUrl: [String],
    watermark: Schema.Types.Mixed
})

const userModel = mongoose.model('user', userSchema)

userSchema.static.findByOpenId = function (openId) {
    
}

export default userModel

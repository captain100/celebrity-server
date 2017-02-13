'use strict'

import mongoose from 'mongoose'
import config from '../config.js'

mongoose.Promise = global.Promise
const db = mongoose.connect(config.db)

export default db

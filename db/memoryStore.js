'use strict'
/**
 * 内粗存储
 */

function MemoryStore () {
    this.store = {}
}
/**
 * [get ]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
MemoryStore.prototype.get = function (key) {
    return this.store[key]
}
/**
 * [getAll description]
 * @return {[type]} [description]
 */
MemoryStore.prototype.getAll = function () {
    return this.store
}
/**
 * [addOrUpdate description]
 * @param {[type]} key   [description]
 * @param {[type]} value [description]
 */
MemoryStore.prototype.addOrUpdate = function (key, value) {
    this.store[key] = value
    return this.store
}
/**
 * [delete description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
MemoryStore.prototype.delete = function (key) {
    delete this.store[key]
    return this.store
}

const memoryStore = new MemoryStore()

export default memoryStore

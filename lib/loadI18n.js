const i18nCore = require('i18n-core')
const i18nChain = require('i18n-core/lookup/chain')
const i18nFs = require('i18n-core/lookup/fs')
const path = require('path')

module.exports = function () {
  const wqPath = path.join(__dirname, 'i18n')
  const qlPath = path.join(this.opts.appDir, 'i18n')
  const i18n = i18nCore(i18nChain(i18nFs(wqPath), i18nFs(qlPath)))
  this.i18n = i18n
  this.__ = this.i18n.__
}

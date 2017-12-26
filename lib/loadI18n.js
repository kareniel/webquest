const i18nCore = require('i18n-core')
const i18nChain = require('i18n-core/lookup/chain')
const i18nFs = require('i18n-core/lookup/fs')
const i18nExtend = require('i18n-core/lookup/extend')
const path = require('path')

module.exports = function () {
  const wqPath = path.join(__dirname, '..', 'i18n')
  const qlPath = path.join(this.opts.appDir, 'i18n')
  const root = i18nCore(i18nChain(i18nFs(wqPath), i18nFs(qlPath)))
  const translator = root.section(this.locale, true)
  const result = i18nCore(i18nExtend(translator, key => {
    // add potential edge cases here
  }))
  root.fallback = key => `?${key}?`
  result.change = lang => {
    translator.changeSection(lang)
  }
  result.extend = obj => {
    return i18nCore(i18nExtend(result, key => {
      return obj[key]
    }))
  }
  result.lang = () => this.locale

  this.i18n = result
  this.__ = this.i18n.__
}

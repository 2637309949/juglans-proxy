// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const options = require('./options')
const proxy = require('./proxy')
const assert = require('assert')

function Proxy (options) {
  if (!(this instanceof Proxy)) {
    return new Proxy(options)
  }
  assert.ok(options.host || options.map || options.url, 'should provide host, map or url')
  this.options = options
}

Proxy.prototype.addOptions = function (...opts) {
  for (const opt of opts) {
    opt.apply(this)
  }
  return this
}

Proxy.prototype.plugin = function ({ httpProxy }) {
  httpProxy.use(proxy(this.options))
}

module.exports = Proxy
module.exports.options = options

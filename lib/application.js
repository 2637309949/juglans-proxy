// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const convert = require('koa-convert')
const proxy = require('koa-proxy')

function Proxy (options) {
  if (!(this instanceof Proxy)) {
    return new Proxy(options)
  }
  this.options = options
}

Proxy.prototype.plugin = function ({ httpProxy }) {
  httpProxy.use(convert(proxy(this.options)))
}

module.exports = Proxy

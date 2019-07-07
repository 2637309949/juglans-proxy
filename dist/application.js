"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const convert = require('koa-convert');

const proxy = require('koa-proxy');

const logger = require('./logger');

function Proxy(params) {
  if (!(this instanceof Proxy)) {
    return new Proxy(params);
  }

  this.params = params;
  this.a = 0;
}

Proxy.prototype.pre = function () {
  logger.info('plugin pre hook from limit');
};

Proxy.prototype.plugin = function (_ref) {
  let {
    httpProxy
  } = _ref;
  httpProxy.use(convert(proxy(this.params)));
};

module.exports = Proxy;
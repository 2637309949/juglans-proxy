"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const convert = require('koa-convert');

const proxy = require('koa-proxy');

module.exports = params => (_ref) => {
  let {
    httpProxy
  } = _ref;
  httpProxy.use(convert(proxy(params)));
};
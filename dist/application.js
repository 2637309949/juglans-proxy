"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
// The whole point of route-specific middleware is to run middleware for a specific route.
// Otherwise there would be no difference between app.use() and router.use().
// If you want middleware to run regardless of any route matching you can mount it on the app via app.use().
// app.use(proxy({
//   host:  'http://xxx.com',
//   match: /^\/static\//,
//   map: function(path) { return 'public/' + path; },
// }));
const convert = require('koa-convert');

const proxy = require('koa-proxy');

module.exports = params => (_ref) => {
  let {
    httpProxy
  } = _ref;
  httpProxy.use(convert(proxy(params)));
};
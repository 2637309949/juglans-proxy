"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const join = require('url').resolve;

const rp = require('request-promise-native');

const requestLib = require('request');

module.exports = function () {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (
    /*#__PURE__*/
    function () {
      var _proxy = _asyncToGenerator(function* (ctx, next) {
        // match request path
        if (options.match) {
          if (!ctx.path.match(options.match)) {
            return next();
          }
        } // resolve url


        const url = resolve(ctx.path, options);

        if (!url) {
          return next();
        }

        let opt = {
          jar: options.jar === true,
          url: url + (ctx.querystring ? '?' + ctx.querystring : ''),
          headers: ctx.request.header,
          encoding: null,
          followRedirect: options.followRedirect !== false,
          method: ctx.method,
          body: parsedBody(ctx),
          simple: false,
          resolveWithFullResponse: true
        };

        if (options.host) {
          opt.headers.host = options.host.slice(options.host.indexOf('://') + 3).replace(/\/$/, '');
        } // replace opts


        if (options.reqOpts) {
          if (typeof options.reqOpts === 'function') {
            opt = options.reqOpts(ctx, opt);
          } else {
            Object.keys(options.reqOpts).forEach(function (option) {
              opt[option] = options.reqOpts[option];
            });
          }
        }

        let res = yield request(ctx, opt); // replace res

        if (options.resOpts) {
          if (typeof options.resOpts === 'function') {
            res = options.resOpts(ctx, res);
          } else {
            Object.keys(options.resOpts).forEach(function (option) {
              res[option] = res.resOpts[option];
            });
          }
        } // replace headers


        for (const name in res.headers) {
          if (name === 'transfer-encoding') {
            continue;
          }

          ctx.set(name, res.headers[name]);
        } // set response


        ctx.status = res.statusCode;
        ctx.body = ctx.body || res.body;
      });

      function proxy(_x, _x2) {
        return _proxy.apply(this, arguments);
      }

      return proxy;
    }()
  );
};

function request(_x3, _x4) {
  return _request.apply(this, arguments);
}

function _request() {
  _request = _asyncToGenerator(function* (ctx, opt) {
    let res;

    if (opt.body || ctx.method === 'GET') {
      res = yield rp(opt);
    } else {
      res = yield pipe(ctx.req, opt);
    }

    return res;
  });
  return _request.apply(this, arguments);
}

function resolve(path, options) {
  let url = path;

  if (options.url) {
    url = options.url;

    if (!/^http/.test(url)) {
      url = options.host ? join(options.host, url) : null;
    }

    return url.split('?')[0];
  }

  if (typeof options.map === 'object') {
    if (options.map && options.map[path]) {
      url = options.map[url];
    }
  } else if (typeof options.map === 'function') {
    url = options.map(url);
  }

  url = url.split('?')[0];
  return options.host ? join(options.host, url) : null;
}

function parsedBody(ctx) {
  let body = ctx.request.body;

  if (body === undefined || body === null) {
    return undefined;
  }

  const contentType = ctx.request.header['content-type'];

  if (!Buffer.isBuffer(body) && typeof body !== 'string') {
    if (contentType && contentType.indexOf('json') !== -1) {
      body = JSON.stringify(body);
    } else {
      body = body + '';
    }
  }

  return body;
}

function pipe(req, opt) {
  return new Promise((resolve, reject) => {
    req.pipe(requestLib(opt, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    }));
  });
}
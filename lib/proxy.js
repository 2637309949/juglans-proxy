// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.

const join = require('url').resolve
const rp = require('request-promise-native')
const requestLib = require('request')

module.exports = (options = {}) => {
  return async function proxy (ctx, next) {
    const url = resolve(ctx.path, options)

    if (!url) {
      return next()
    }

    if (options.match) {
      if (!ctx.path.match(options.match)) {
        return next()
      }
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
    }

    if (options.host) {
      opt.headers.host = options.host.slice(options.host.indexOf('://') + 3).replace(/\/$/, '')
    }

    // replace opts
    if (options.reqOpts) {
      if (typeof options.reqOpts === 'function') {
        opt = options.reqOpts(ctx, opt)
      } else {
        Object.keys(options.reqOpts).forEach(function (option) {
          opt[option] = options.reqOpts[option]
        })
      }
    }

    let res = await request(ctx, opt)
    // replace res
    if (options.resOpts) {
      if (typeof options.resOpts === 'function') {
        res = options.resOpts(ctx, res)
      } else {
        Object.keys(options.resOpts).forEach(function (option) {
          res[option] = res.resOpts[option]
        })
      }
    }

    // replace headers
    for (const name in res.headers) {
      if (name === 'transfer-encoding') {
        continue
      }
      ctx.set(name, res.headers[name])
    }

    // set response
    ctx.status = res.statusCode
    ctx.body = ctx.body || res.body
  }
}

async function request (ctx, opt) {
  let res
  if (opt.body || ctx.method === 'GET') {
    res = await rp(opt)
  } else {
    res = await pipe(ctx.req, opt)
  }
  return res
}

function resolve (path, options) {
  let url = path
  if (options.url) {
    url = options.url
    if (!/^http/.test(url)) {
      url = options.host ? join(options.host, url) : null
    }
    return url.split('?')[0]
  }
  if (typeof options.map === 'object') {
    if (options.map && options.map[path]) {
      url = options.map[url]
    }
  } else if (typeof options.map === 'function') {
    url = options.map(url)
  }
  url = url.split('?')[0]
  return options.host ? join(options.host, url) : null
}

function parsedBody (ctx) {
  let body = ctx.request.body
  if (body === undefined || body === null) {
    return undefined
  }
  const contentType = ctx.request.header['content-type']
  if (!Buffer.isBuffer(body) && typeof body !== 'string') {
    if (contentType && contentType.indexOf('json') !== -1) {
      body = JSON.stringify(body)
    } else {
      body = body + ''
    }
  }
  return body
}

function pipe (req, opt) {
  return new Promise((resolve, reject) => {
    req.pipe(requestLib(opt, (error, response) => {
      if (error) return reject(error)
      resolve(response)
    }))
  })
}

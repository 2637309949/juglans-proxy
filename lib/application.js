/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [koa proxy]
 */
// The whole point of route-specific middleware is to run middleware for a specific route.
// Otherwise there would be no difference between app.use() and router.use().
// If you want middleware to run regardless of any route matching you can mount it on the app via app.use().
// app.use(proxy({
//   host:  'http://xxx.com',
//   match: /^\/static\//,
//   map: function(path) { return 'public/' + path; },
// }));

const convert = require('koa-convert')
const proxy = require('koa-proxy')
module.exports = (params) => ({ httpProxy }) => {
  httpProxy.use(convert(proxy(params)))
}

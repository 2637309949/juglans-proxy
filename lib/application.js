/**
 * @author [Double]
 * @email [2637309949@qq.com]
 * @create date 2019-01-09 16:55:19
 * @modify date 2019-01-09 16:55:19
 * @desc [koa proxy]
 */
// app.use(proxy({
//   host:  'http://xxx.com',
//   match: /^\/static\//,
//   map: function(path) { return 'public/' + path; },
// }));

const proxy = require('koa-proxy')
module.exports = (params) => async function ({ router }) {
  router.use(proxy(params))
}

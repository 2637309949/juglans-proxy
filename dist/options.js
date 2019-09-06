"use strict";

// Copyright (c) 2018-2020 Double.  All rights reserved.
// Use of this source code is governed by a MIT style
// license that can be found in the LICENSE file.
const assert = require('assert').strict;

const is = require('is');

class Option {
  constructor(funk) {
    this.funk = funk;
  }

  apply(j) {
    return this.funk(j);
  }

  check(j) {
    return this.funk(j);
  }

}

module.exports.reqOption = function (req) {
  assert.ok(is.function(req), 'req can not be empty!');
  return new Option(function (i) {
    i.options.reqOpts = req;
    return i;
  });
};

module.exports.resOption = function (res) {
  assert.ok(is.function(res), 'res can not be empty!');
  return new Option(function (i) {
    i.options.resOpts = res;
    return i;
  });
};

module.exports.Option = Option;
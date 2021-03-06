'use strict';

var restify = require('restify');
var querystring = require('querystring');
var path = require('path');

var clients = {};
var model = 'production';

function shallowCopy(obj) {
	if (!obj) {
		return (obj);
	}
	var copy = {};
	Object.keys(obj).forEach(function(k) {
		copy[k] = obj[k];
	});
	return (copy);
}

/**
 * 配置
 * 如果加载本地测试数据：{ 'model':'test', path: 'xxx' }
 * 如果是远程rest: {'model': 'production', 'default': restify的配置对象}
 */
function config(options) {
	model = options['model'] || 'production';
	if (model === 'test') {
		clients['default'] = options['path'];
	} else {
		for (var i in options) {
			if (i !== 'model') {
				clients[i] = restify.createJsonClient(options[i]);
				var _ops = shallowCopy(options[i]);
				_ops['accept'] = 'application/json';
				clients[i + '_'] = restify.createStringClient(_ops);
			}
		}
	}
}

function callback(err, req, res, data, fn) {
	var obj = null;
	try {
		if (data && !/^\s*$/.test(data)) {
			obj = JSON.parse(data);
		}
	} catch (e) {
		obj = null;
	}
	fn(err, req, res, obj);
}

function get_test_data(url, name, method) {
	var p = path.join(clients[name], url.replace(/\//ig, '_').substr(1) + '.json');
	return require(p)[method];
}

function get_real_url(url, params) {
	var p = querystring.stringify(params);
	return p ? url + '?' + p : url;
}

function get(url, params, fn, name) {
	name = name || 'default';
	if (model === 'test') {
		fn(null, null, null, get_test_data(url, name, 'get'));
	} else {
		clients[name].get(get_real_url(url, params), fn);
	}
}

function del(url, params, fn, name) {
	name = name || 'default';
	if (model === 'test') {
		fn(null, null, null, get_test_data(url, name, 'del'));
	} else {
		clients[name].del(get_real_url(url, params), fn);
	}
}

function put_string(url, params, fn, name) {
	name = name || 'default';
	if (model === 'test') {
		fn(null, null, null, get_test_data(url, name, 'put'));
	} else {
		clients[name + '_'].put(url, params, function(err, req, res, data) {
			callback(err, req, res, data, fn);
		});
	}
}

function post_string(url, params, fn, name) {
	name = name || 'default';
	if (model === 'test') {
		fn(null, null, null, get_test_data(url, name, 'post'));
	} else {
		clients[name + '_'].post(url, params, function(err, req, res, data) {
			callback(err, req, res, data, fn);
		});
	}
}

function put_json(url, params, fn, name) {
	name = name || 'default';
	if (model === 'test') {
		fn(null, null, null, get_test_data(url, name, 'put'));
	} else {
		clients[name].put(url, params, fn);
	}
}

function post_json(url, params, fn, name) {
	name = name || 'default';
	if (model === 'test') {
		fn(null, null, null, get_test_data(url, name, 'post'));
	} else {
		clients[name].post(url, params, fn);
	}
}

module.exports = {
	'get': get,
	'del': del,
	'post_form': post_string,
	'put_form': put_string,
	'post': post_json,
	'put': put_json,
	'config': config
};
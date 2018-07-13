# util-restify

restify的封装连接器

## Getting Started
Install the module with: `npm install util-restify`

## Documentation
支持两种配置(**通常配置在config.json中**)：

+ 本地测试，不发送http请求，直接加载本地的测试数据文件

```
{ "model": "test", "path": "xxx" }
```

+ 远程rest

```
{
	"default": {
		connectTimeout: 3000, //连接超时
		requestTimeout: 10000, //响应超时
		retry: false, //是否重试，建议关闭
		url: url  //远程地址
	}
}
```

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2016 xiejun
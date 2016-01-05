'use strict';

/*
* *
 * [Part I](part1/README.md)
 *      [Writing is nice](part1/writing.md)
 *      [GitBook is nice](part1/gitbook.md)
* */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

function makeContentTable() {
	var linkTemplate = _.template('[${ title }](${ path })');
	fs.readFile(path.join(__dirname, 'abs-3.9.1_cn', 'index.html'), function (err, data) {
		if (err) console.error(err);

		var html = iconv.decode(data, 'GBK');
		var $ = cheerio.load(html);

		// 目录
		var contentTable = parseDl($('.TOC > dl'));

		// 表格清单
		var tableList = parseDl($('.LOT > dl').first());

		// 例子清单
		var exampleList = parseDl($('.TOC > dl').last());


		function parseDl($dl) {
			var res = [];

			$dl.children().each(function (i, el) {
				if (el.name === 'dt') return res.push(parseDt($(el)));
				if (el.name === 'dd') return res.push(parseDl($(el).children().first()));
			});

			return res;
		}

		function parseDt($dt) {
			return {
				title: $dt.text(),
				path: $dt.find('a').attr('href')
			}
		}
	})
}

makeContentTable();

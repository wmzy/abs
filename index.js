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
	var preface = [];
	var contentTable = [];
	fs.readFile(path.join(__dirname, 'abs-3.9.1_cn', 'index.html'), function (err, data) {
		if (err) console.error(err);

		var html = iconv.decode(data, 'GBK');
		var $ = cheerio.load(html);
		var $contentTable = $('.TOC > dl');

		parseDl($contentTable)

		// 移除‘目录’节点
		$contentTable.children().first().remove();

		// 序
		var $preface = $contentTable.children().first().remove();
		var $prefaceItems = $contentTable.children().first().remove().find('dt:has(a)');
		preface.push({title: $preface.text(), path: $preface.find('a').attr('href')});
		$prefaceItems.each(function () {
			preface.push({title: $(this).text(), path: $(this).find('a').attr('href')});
		});

		console.log(preface);

		// todo:参考文献


		// todo:目录

		console.log($contentTable.find('dt:has(a)').first().text());
		function parseDl($dl) {
			return $dl.children().map(function (i, el) {
				if (el.name === dt) return parseDt(el);

				if (el.name === 'dd') return parseDl($(el).children().first());
			})
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

'use strict';

var thenifyAll = require('thenify-all');
var fs = thenifyAll(require('fs'));
var path = require('path');
var _ = require('lodash');
var co = require('co');
var async = require('async');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var toMarkdown = require('to-markdown');
var sourceDir = path.join(__dirname, 'abs-3.9.1_cn');
var destDir = path.join(__dirname, 'dest');

function makeContentTable() {
	return co(function *() {
		var data = yield fs.readFile(path.join(sourceDir, 'index.html'));

		var html = iconv.decode(data, 'GBK');
		var $ = cheerio.load(html);

		// 目录
		var contentTable = parseDl($('.TOC > dl'));

		// 表格清单
		var tableList = parseDl($('.LOT > dl').first());

		// 例子清单
		var exampleList = parseDl($('.LOT > dl').last());

		//console.log(contentTable)
		fs.writeFile(path.join(destDir, 'SUMMARY.md'), contentTable + tableList + exampleList);

		function parseDl($dl, indentation) {
			indentation = indentation || '';
			var res = '';

			$dl.children().each(function (i, el) {
				if (el.name === 'dt') return res += indentation + parseDt($(el), indentation);
				if (el.name === 'dd') return res += parseDl($(el).children().first(), indentation + '    ');
			});

			return res;
		}

		function parseDt($dt) {
			return '* [' + $dt.text().replace(/\s+/g, ' ').replace(/\[/g, '\\[').replace(/\]/g, '\\]') + ']('
				+ ($dt.find('a').attr('href') || 'index.html').replace('.html', '.md') + ')\n';
		}
	});
}

function markdownAll() {
	return co(function *() {
		var filenames = yield fs.readdir(sourceDir);
		yield _.filter(filenames, (filename) => filename.endsWith('.html')).map(markdownIt);
	});
}

function markdownIt(filename) {
	return co(function *() {
		var file = yield fs.readFile(path.join(sourceDir, filename));
		var html = iconv.decode(file, 'GBK');
		var $ = cheerio.load(html, {
			normalizeWhitespace: false,
			decodeEntities: false
		});

		$('.NAVHEADER, .NAVFOOTER').remove();
		$('a').each(function () {
			if (!$(this).text()) $(this).remove();
			if (this.attribs && this.attribs.href) this.attribs.href = this.attribs.href.replace('.html', '.md');
		});

		$('a, h1, i').each(function () {
			var $this = $(this);
			$this.html($this.text());
		});

		$('dl').each(function () {
			this.name = 'ul'
		});
		$('dd, dt').each(function () {
			this.name = 'li'
		});

		function unwrap(tagName) {
			var $divs = $(tagName);

			while ($divs.length) {
				$divs.each(function () {
					var $this = $(this);
					$this.replaceWith($this.html());
				});

				$divs = $(tagName);
			}
		}

		unwrap('div');
		unwrap('font');

		var markdownString = toMarkdown($('body').html() || '', {gfm: true});
		yield fs.writeFile(path.join(destDir, filename.replace('.html', '.md')), markdownString);
	});
}

markdownAll().catch((err) => console.log('err:', err));

makeContentTable().catch((err) => console.log(err));

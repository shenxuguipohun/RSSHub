/*
 * @Author: Snow
 * @Date: 2022-01-12 23:33:54
 * @LastEditors: Snow
 * @LastEditTime: 2022-01-12 23:39:11
 * @Description:
 * @FilePath: /RSSHub/lib/routes/picxx/picture.js
 */
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://picxx.icu/';
    const currentUrl = `${rootUrl}/page/1`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);
    const list = $('.col-sm-12')
        .map((_, item) => {
            item = $(item);
            return {
                title: item.find('.entry-meta').find('.entry-categories').text(),
                link: item.find('a.entry-image').attr('href'),
                description: `<img src="${item.find('.entry-image').find('img').attr('src')}">`,
                pubDate: item.find('.entry-meta').find('.entry-date').find('a').text(),
            };
        })
        .get();

    ctx.state.data = {
        title: 'picxx',
        link: currentUrl,
        item: list,
    };
};

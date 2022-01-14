/*
 * @Author: Snow
 * @Date: 2022-01-12 23:33:54
 * @LastEditors: Snow
 * @LastEditTime: 2022-01-14 15:01:26
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
                link: item.find('a.entry-image').attr('href'),
            };
        })
        .get();

    const out = await Promise.all(
        list.map(async (info) => {
            const response = await got({
                method: 'get',
                url: info.link,
            });
            const $info = cheerio.load(response.data);
            return {
                title: $info('.entry-meta').find('.entry-categories').find('a').text(),
                link: info.link,
                description: getImages($info),
                pubDate: $info('.entry-meta').find('.entry-date').text(),
            };
        })
    );

    ctx.state.data = {
        title: 'picxx',
        link: currentUrl,
        item: out,
    };
};

function getImages($info) {
    const imgs = [];
    $info('.wp-block-image').map((_, img) => imgs.push($info(img).find('img').attr('src')));
    const temp = [];
    imgs.forEach((item) => {
        temp.push(`<p><img src="${item}"/></p>`);
    });
    return temp.join('');
}

/*
 * @Author: Snow
 * @Date: 2022-01-12 23:33:54
 * @LastEditors: Snow
 * @LastEditTime: 2022-01-13 16:55:52
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
    const imgList = $info('.wp-block-image');
    const imgs = [];
    imgList.map((img) => imgs.push(`<img src="${$info(img).find('img').attr('src')}">`));
    return imgs.join('<br>');
}

/*
 * @Author: Snow
 * @Date: 2022-01-10 17:27:19
 * @LastEditors: Snow
 * @LastEditTime: 2022-01-10 19:00:17
 * @Description:
 * @FilePath: /RSSHub/lib/routes/jkforum/qingliang.js
 */
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://www.jkforum.net';
    const currentUrl = `${rootUrl}/forum-234-1.html`;

    const response = await got({
        method: 'get',
        url: currentUrl,
    });

    const $ = cheerio.load(response.data);

    const list = $('.bm_c #waterfall li')
        .map((_, item) => {
            item = $(item);
            let style = item.find('a').attr('style');
            let index_01 = style.indexOf("background-image: url('");
            let index_02 = style.indexOf("'); ", index_01);
            let imgSrc = style.substring(index_01 + "background-image: url('".length, index_02);
            return {
                title: item.find('h3 a').text(),
                link: `${rootUrl}/${item.find('a').attr('href')}`,
                description: `<img src="${imgSrc}">`,
                pubDate: new Date(item.parents('div').eq(0).find('span').text()).toUTCString(),
            };
        })
        .get();

    ctx.state.data = {
        title: 'JKF 捷克論壇 - 貼圖 - 清涼寫真',
        link: currentUrl,
        item: list,
    };
};

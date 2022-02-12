/*
 * @Author: Snow
 * @Date: 2022-01-10 18:58:20
 * @LastEditors: Snow
 * @LastEditTime: 2022-02-13 00:12:52
 * @Description:
 * @FilePath: /RSSHub/lib/routes/douban/group.js
 */
const got = require('../../utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const groupid = ctx.params.groupid;
    const type = ctx.params.type;

    const url = `https://www.douban.com/group/${groupid}/${type ? `?type=${type}` : ''}`;
    const response = await got({
        method: 'get',
        url,
    });

    const $ = cheerio.load(response.data);
    const list = $('.olt tr:not(.th)').slice(0, 30).get();

    const items = await Promise.all(
        list.map((item) => {
            const $1 = $(item);
            const result = {
                title: $1.find('.title a').attr('title'),
                author: $1.find('a').eq(1).text(),
                link: $1.find('.title a').attr('href'),
            };
            return ctx.cache.tryGet(result.link, async () => {
                try {
                    const detailResponse = await got({
                        method: 'get',
                        url: result.link,
                    });
                    const $ = cheerio.load(detailResponse.data);

                    result.pubDate = $('.create-time').text();
                    result.description = $('.rich-content').html() + $('.topic-reply').html();
                    return result;
                } catch (error) {
                    return result;
                }
            });
        })
    );

    ctx.state.data = {
        title: `豆瓣小组-${$('h1').text().trim()}`,
        link: url,
        item: items,
    };
};

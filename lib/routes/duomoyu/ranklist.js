/*
 * @Author: Snow
 * @Date: 2022-01-14 15:09:35
 * @LastEditors: Snow
 * @LastEditTime: 2022-01-14 15:36:11
 * @Description:
 * @FilePath: /RSSHub/lib/routes/duomoyu/ranklist.js
 */
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const rootUrl = 'https://duomoyu.com/';

    const response = await got({
        method: 'get',
        url: rootUrl,
    });

    const $ = cheerio.load(response.data);
    const list = [1];
    const info = list.map(() => ({
        title: '多摸鱼聚合热搜榜',
        link: rootUrl,
        description: getDataList($),
        pubDate: new Date().toUTCString(),
    }));

    ctx.state.data = {
        title: '多摸鱼聚合热搜榜',
        link: rootUrl,
        item: info,
    };
};

function getDataList($) {
    const rankBox = $('.channel_box');
    const info = [];
    rankBox.map((_, box) => {
        let code = `<h2>${$(box).find('.channel_title').html()}</h2>`;
        $(box)
            .find('.cardbox .simplebar-wrapper .simplebar-mask .simplebar-offset .simplebar-content-wrapper .simplebar-content')
            .find('.card_sub_box')
            .map((_, data) => {
                data = $(data);
                return (code += `<a href="${data.find('a').attr('href')}">${data.find('a').text()}</a>`);
            });

        return info.push(code);
    });
    return info.join('<br/>');
}

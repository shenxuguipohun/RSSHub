/*
 * @Author: Snow
 * @Date: 2022-01-14 22:44:48
 * @LastEditors: Snow
 * @LastEditTime: 2022-01-14 23:14:42
 * @Description:
 * @FilePath: /RSSHub/lib/routes/tophub/topDataList.js
 */
const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const id = ctx.params.id;

    const link = `https://tophub.today/n/${id}`;
    const response = await got.get(link);
    const $ = cheerio.load(response.data);

    const title = $('div.Xc-ec-L.b-L').text().trim();

    const description = getDescription($('table.table').first().find('tbody tr'), $);

    const out = [
        {
            title,
            description: `<div style="width:100%;padding:16px; background-color:#f0f0f0; border: 1px #eee solid;">${description.join('')}</div>`,
        },
    ];

    ctx.state.data = {
        title,
        link,
        item: out,
    };
};

function getDescription(trList, $) {
    const list = [];
    trList.map((_, item) => {
        item = $(item);
        let code = '';
        code += `<p style="line-height:24px; margin-bottom: 8px; border-bottom: 1px #eee solid;"><a href="${item.find('.al a').attr('href')}" _target="black">${item.find('.al a').text()}</a></p>`;
        return list.push(code);
    });
    return list;
}

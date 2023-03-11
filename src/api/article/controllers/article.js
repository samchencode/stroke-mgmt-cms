"use strict";

/**
 * article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const StrapiMarkdown = require("../../../lib/md.js");
const model = require("../content-types/article/schema.json");
const cmpts = {
  'algorithm-components.criterion': require('../../../components/algorithm-components/criterion.json'),
  'algorithm-components.outcome': require('../../../components/algorithm-components/outcome.json') ,
  'algorithm-components.switch': require('../../../components/algorithm-components/switch.json'),
}

const { md } = new StrapiMarkdown(model, cmpts);

module.exports = createCoreController("api::article.article", () => ({
  async find(ctx) {
    const result = await super.find(ctx);
    if(!result) return result;
    const { data, meta } = result;
    return { data: await md(data), meta };
  },
  async findOne(ctx) {
    const result = await super.findOne(ctx);
    if(!result) return result;
    const { data, meta } = result;
    return { data: await md(data), meta };
  },
}));

"use strict";

/**
 * article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const StrapiMarkdown = require("../../../lib/md.js");
const model = require("../content-types/article/schema.json");

const { md } = new StrapiMarkdown(model);

module.exports = createCoreController("api::article.article", () => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data: await md(data), meta };
  },
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    return { data: await md(data), meta };
  },
}));

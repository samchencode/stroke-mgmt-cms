'use strict';

/**
 * algorithm controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const StrapiMarkdown = require("../../../lib/md.js");
const model = require("../content-types/algorithm/schema.json");
const cmpts = {
  'algorithm-components.criterion': require('../../../components/algorithm-components/criterion.json'),
  'algorithm-components.outcome': require('../../../components/algorithm-components/outcome.json') ,
  'algorithm-components.switch': require('../../../components/algorithm-components/switch.json'),
}

const { md } = new StrapiMarkdown(model, cmpts);

// FIXME: md doesn't work with component fields like outcomes and switches yet

module.exports = createCoreController('api::algorithm.algorithm', () => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data: await md(data), meta };
  },
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    return { data: await md(data), meta };
  },
}));

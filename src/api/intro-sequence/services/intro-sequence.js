'use strict';

/**
 * intro-sequence service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::intro-sequence.intro-sequence');

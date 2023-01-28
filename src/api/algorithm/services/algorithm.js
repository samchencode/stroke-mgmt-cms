'use strict';

/**
 * algorithm service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::algorithm.algorithm');

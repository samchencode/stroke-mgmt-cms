module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/_health',
     handler: 'health-check.execute',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};

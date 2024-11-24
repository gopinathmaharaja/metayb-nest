export const pinoHttpOptions = {
  level: 'info',
  autoLogging: false,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
};

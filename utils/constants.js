module.exports.SECRET_KEY = 'ptnpnh000';
module.exports.OK_CREATED_CODE = 201;
module.exports.MONGO_SERVER_ADDRESS = 'mongodb://localhost:27017/newsdb';
module.exports.RATE_LIMITER_CONFIGURATIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
};

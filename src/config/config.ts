export default () => ({
  port: parseInt(process.env.SERVER_PORT || '3000', 10),
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  dynamodb: {
    userTable: process.env.DYNAMODB_USER_TABLE,
    thingTable: process.env.DYNAMODB_THING_TABLE,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expires: process.env.JWT_EXPIRES_TIME,
  },
  crypto: {
    secret: process.env.CRYPTO_SECRET_KEY,
  },
})

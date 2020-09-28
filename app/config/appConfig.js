let config = {
  apiVersion: "/api/v1",
  PORT: process.env.PORT || 3001,
  JWT_SECRET:"smkccss",
  mongodb: {
    produrl: "mongodb+srv://admin:admin123@todolist.luwaj.mongodb.net/todolist?retryWrites=true&w=majority",
  localurl:"mongodb://localhost:27017/todolist"
  },
  env: "prod",
};

module.exports = { config: config };

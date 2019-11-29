// 引入mysql模块
const mysql = require("mysql");

// 创建连接池对象
let pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "eb",
  connectionLimit: 10
});

// 导出连接池对象
module.exports = pool;

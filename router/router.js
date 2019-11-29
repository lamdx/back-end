const express = require("express");
// 引入连接池模块
const pool = require("../pool");
// console.log(pool)

// 创建路由器对象
let router = express.Router();

// 添加路由
/*
 * 渲染添加学生页面
 */
router.get('/new', function(req, res) {
  res.render('index.html')
})

/*
* 处理添加学生
*/
router.post('/new', function(req, res) {
  // 1. 获取表单数据
  // 2. 处理
  //    将数据保存到 db.json 文件中用以持久化
  // 3. 发送响应
  Student.save(req.body, function(err) {
      if (err) {
          return res.status(500).send('Sever error.')
      }
      res.redirect('/new')
  })
})

/**
* 渲染编辑学生页面
*/
router.get('/edit', function(req, res) {
  // 1. 在客户端的列表页中处理链接问题（需要有 id 参数）
  // 2. 获取要编辑的学生 id
  // 3. 渲染编辑页面
  //    根据 id 把学生信息查出来
  //    使用模板引擎渲染页面
  Student.findById(parseInt(req.query.id), function(err, student) {
      if (err) {
          return res.status(500).send('Sever error.')
      }
      // console.log(student)
      res.render('edit.html', {
          student: student
      })

  })
})

/**
* 处理编辑学生页面
*/
router.post('/edit', function(req, res) {
  // 1. 获取表单数据
  //    req.body
  // 2. 更新
  //    Student.updateById()
  // 3. 发送响应
  // console.log(req.body)
  Student.undateById(req.body, function(err) {
      if (err) {
          return res.status(500).send('Sever error.')
      }
      res.redirect('/new')
  })
})

/**
* 处理删除学生
*/
router.get('/delete', function(req, res) {
  // 1. 获取要删除的 id
  // 2. 根据 id 执行删除操作
  // 3. 根据操作结果发送响应数据
  Student.deleteById(req.query.id, function(err) {
      if (err) {
          return res.status(500).send('Sever error.')
      }
      res.redirect('/new')
  })
})

// 导出路由器对象
module.exports = router;

$(function () {
  // 点击“去注册”链接
  $('#link_reg').click(function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  // 点击“去登录”链接
  $('#link_login').click(function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

  // 从layui中获取对象
  let form = layui.form
  let layer = layui.layer
  // 自定义密码框校验规则
  form.verify({
    username: function (value, item) { //value：表单的值、item：表单的DOM对象
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return '用户名不能有特殊字符';
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return '用户名首尾不能出现下划线\'_\'';
      }
      if (/^\d+\d+\d$/.test(value)) {
        return '用户名不能全为数字';
      }
    },
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      let pwd = $('.reg-box [name="password"]').val()
      if (value !== pwd) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').submit(function (e) {
    e.preventDefault()
    // 发起Ajax的post请求
    let data = {
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录！')
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.post('/api/login', $(this).serialize(), function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('登录成功')
      // 将登录成功的token字符串，保存到本地存储
      localStorage.setItem('token', res.token)
      location.href = 'index.html'
    })
  })
})
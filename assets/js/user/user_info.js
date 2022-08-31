$(function () {
  let form = layui.form
  let layer = layui.layer
  // 表单验证
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })
  // 初始化用户的基本信息
  initUserInfo()
  function initUserInfo() {
    $.get('/my/userinfo', function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败！')
      }
      // console.log(res)
      // 表单赋值
      form.val('formUserInfo', res.data)
    })
  }

  // 监听重置按钮事件
  $('#btnReset').click(function (e) {
    e.preventDefault()
    // 重新获取用户信息
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    // 发起post请求
    $.post('/my/userinfo', $(this).serialize(), function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      console.log(res)
      layer.msg(res.message)
      // 调用父页面中的方法，重新获取用户信息并渲染
      console.log(window.parent)
      window.parent.getUserInfo()
    })
  })

})
$(function () {
  let form = layui.form
  // 表单校验
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同！'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次输入密码不一致！'
      }
    }
  })

  // 监听表单提交事件
  $('.layui-form').submit(function (e) {
    e.preventDefault()
    // 发起post请求
    $.post('/my/updatepwd', $(this).serialize(), function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message)
      }
      layui.layer.msg(res.message)
      // 重置表单
      $('.layui-form')[0].reset()
    })
  })

})
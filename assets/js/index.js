$(function () {
  getUserInfo()

  let layer = layui.layer

  // 实现点击按钮退出功能
  $('#btnLogout').click(function () {
    // 提示用户是否退出
    layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 清空本地存储中的token
      localStorage.removeItem('token')
      // 跳转到login页面
      location.href = 'login.html'
      // 关闭confirm询问框
      layer.close(index)
    });
  })
})

// 把定义的方法放在外面可供子页面调用
// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    url: '/my/userinfo',
    method: 'GET',
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      // console.log(res)
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败！')
      }
      // 渲染用户头像
      renderAvatar(res.data)
    },
    // // 不论成功还是失败，最终都会调用 complete 回调函数
    // complete: function(res) {
    //   console.log(res)
    //   // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === ' 身份认证失败！') {
    //     // 1. 强制清空 token
    //     localStorage.removeItem('token')
    //     // 2. 强制跳转到登录页面
    //     location.href = '/login.html'
    //   }
    // }
  })
}

// 渲染用户头像
function renderAvatar(user) {
  // 获取用户名称，nickname优先
  let name = user.nickname || user.username
  // 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 渲染头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img')
      .attr('src', user.user_pic)
      .show()
    $('.text_avatar').hide()
  } else {
    // 渲染文字头像
    let first = name[0].toUpperCase()
    $('.layui-nav-img').hide()
    $('.text_avatar')
      .html(first)
      .show()
  }
}

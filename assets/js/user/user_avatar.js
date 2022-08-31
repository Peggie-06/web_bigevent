$(function () {
  let layer = layui.layer
  // 1.1获取裁剪区域的DOM元素
  let $image = $('#image')
  // 1.2配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  // 为文件选择框绑定 change 事件
  $('#file').on('change', function (e) {
    // console.log(e)
    // 获取用户选择的文件 e.target中有个files属性,伪数组
    var FileList = e.target.files
    if (FileList.length === 0) {
      return layer.msg('请选择照片！')
    }

    // 1. 拿到用户选择的文件
    var file = e.target.files[0]
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
    // 3. 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 为确定按钮绑定点击事件
  $('#btnUpload').click(function () {
    // 1. 要拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

      // 发送post请求将头像上传到服务器
    $.post('/my/update/avatar', { avatar: dataURL }, function (res) {
      if (res.status !== 0) {
        return layer.msg('更新头像失败！')
      }
      layer.msg(res.message)
      // 调用父页面的方法重新渲染头像
      window.parent.getUserInfo()
    })
  })

})
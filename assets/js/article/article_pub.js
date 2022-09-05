$(function () {
  // 获取url传递的参数
  let id = window.location.search.split('=')[1]

  let layer = layui.layer
  let form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 定义获取文章分类的方法
  function initCate() {
    $.get('/my/article/cates', function (res) {
      if (res.status !== 0) {
        return layer.msg('初始化文章分类失败！')
      }
      // 渲染下拉选择框
      let htmlStr = template('tpl-cate', res)
      $('[name=cate_id]').html(htmlStr)
      // 一定记得调用 form.render() 更新渲染  因为模板结构是动态添加的
      form.render()
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面按钮绑定点击事件
  $('#btnChooseImage').click(function () {
    // 触发文件选择框
    $('#coverFile').click()
  })

  // 监听 coverFile 的 change 事件，获取用户选择的文件列表
  $('#coverFile').change(function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  let art_state = '已发布'

  // 为存为草稿按钮绑定点击事件
  $('#btnSave').click(function () {
    art_state = '草稿'
  })

  // 为表单绑定 submit事件
  $('#form_pub').submit(function (e) {
    e.preventDefault()
    // 基于form表单创建一个FormData对象
    let fd = new FormData($(this)[0])
    // 将文章的发布状态存到fd中
    fd.append('state', art_state)
    // 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //  将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 调用publishArt()发起ajax请求
        // 判断是否有 id，如果有则说明是修改文章，否则是添加文章
        if (id) {
          fd.append('id', id)
          pubArticle(fd, '/my/article/edit')
        } else {
          pubArticle(fd, '/my/article/add')
        }
      })
  })

  function pubArticle(data, url) {
    $.ajax({
      url: url,
      method: 'POST',
      data: data,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      processData: false,
      contentType: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg(res.message)
        // window.parent.setNavSelected('#article-list', '#article-pub')
        // console.log(window.parent)
        // 发布成功后跳转到文章列表页面
        location.href = '/article/article_list.html'
      }
    })
  }

  // 用文章旧数据渲染页面
  if (id) {
    $('.layui-card-header').html('修改文章')
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg)
        }
        form.val('form_edit', res.data)
        $image.cropper('destroy').attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img).cropper(options)
      }
    })
  }


})
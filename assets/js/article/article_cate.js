$(function () {
  let layer = layui.layer
  let form = layui.form

  // 发送请求获取文章列表数据
  initArtCate()
  function initArtCate() {
    $.get('/my/article/cates', function (res) {
      let htmlStr = template('tpl-table', res)
      // 渲染tbody
      $('tbody').html(htmlStr)
    })
  }

  // 为添加类别按钮绑定点击事件
  let indexAdd = null
  $('#btnAddCate').click(function () {
    // 使用 layer.open 展示弹出层
      indexAdd = layer.open({
      type: 1,
      title: '添加文章分类',
      area: ['500px', '250px'],
      content: $('#dialog_add').html()
      // 获得添加分类弹出层的结构进行渲染
    })
  })

  // 通过代理的方式为添加分类的表单绑定提交事件
  $('body').on('submit', '#form_add', function (e) {
    e.preventDefault()
    // 发送 post 请求
    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        initArtCate()
        layer.msg(res.message)
        // 关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理的方式为编辑按钮绑定点击事件
  let indexEdit = null
  $('tbody').on('click', '.btn_edit', function () {
    indexEdit = layer.open({
      type: 1,
      title: '修改文章分类',
      area: ['500px', '250px'],
      content: $('#form_edit').html()
    })

    let id = $(this).attr('data-id')
    // 发起get请求获取对应分类的数据
    $.get('/my/article/cates' + id, function (res) {
      form.val('form_edit', res.data)
    })
  })

  // 为编辑按钮弹出的表单绑定 submit 事件
  $('body').on('submit', '#form_edit', function (e) {
    e.preventDefault()
    // 更新文章的分类数据
    $.ajax({
      url: '/my/article/updatecate',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        layer.close(indexEdit)
        initArtCate()
      }
    })
  })

  // 为删除按钮绑定点击事件
  $('tbody').on('click', '.btn_delete', function () {
    let id = $(this).attr('data-id')
    // 询问是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.get('/my/article/deletecate/' + id, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        layer.close(index)
        initArtCate()
      })
    })
  })

})
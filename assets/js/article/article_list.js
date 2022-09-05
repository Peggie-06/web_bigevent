$(function () {
  let layer = layui.layer
  let form = layui.form
  let laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    let dt = new Date(date)

    let y = dt.getFullYear()
    let m = padZero(dt.getMonth() + 1)
    let d = padZero(dt.getDate())
    let hh = padZero(dt.getHours())
    let mm = padZero(dt.getMinutes())
    let ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
  let q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initList()
  initCate()
  // 获取文章列表数据的方法
  function initList() {
    $.get('/my/article/list', q, function (res) {
      if (res.status !== 0) {
        return layer.msg('获取文章列表失败！')
      }
      let htmlStr = template('tpl-list', res)
      $('tbody').html(htmlStr)
      // 渲染分页
      renderPage(res.total)
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    // 发起请求获取文章分类
    $.get('/my/article/cates', function (res) {
      if (res.status !== 0) {
        return layer.msg('获取文章分类列表失败！')
      }
      // 渲染分类下拉选择框
      let htmlStr = template('tpl-cate', res)
      $('[name=cate_id]').html(htmlStr)
      // 表单更新渲染
      // form.render()
      form.render('select')
    })
  }

  // 为筛选按钮绑定 submit 事件
  $('#form_filter').submit(function (e) {
    e.preventDefault()
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    // 为查询对象q中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格数据
    initList()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render() 方法渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示条数
      limits: [2,3,5,10], // 每页条数的下拉选择项
      curr: q.pagenum, // 默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 分页发生切换时触发jump回调
      // 有两种情况可以触发：1.点击页码 2. 调用了laypage.render()方法就会触发
      // 所以要通过first参数判断是哪一种情况，以保证第一种情况才触发回调
      jump: function (obj, first) {
        // console.log(obj.curr)
        // 将最新的页码值赋值给 q 对象
        q.pagenum = obj.curr
        // 把最新的条目数，赋值给 q 这个查询参数对象
        q.pagesize = obj.limit
        // 首次不执行
        if (!first) {
          // 根据最新的 q 获取对应的数据列表，并渲染表格
          initList()
        }
      }
    })
  }

  // 通过代理的方式为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数，用来判断还有几条数据
    let len = $('.btn-delete').length
    // 获取文章的id
    let id = $(this).attr('data-id')
    // 询问用户是否删除
    layer.confirm('确认删除此篇文章?', { icon: 3, title: '提示' }, function (index) {
      $.get('/my/article/delete/' + id, function (res) {
        if (res.status !== 0) {
          return layer.msg('删除失败！')
        }
        layer.msg(res.message)
        // 数据删除完成后，需要判断当前页是否还有剩余数据
        // 如果还剩一条数据，则删除完之后就没有了，则页码值减 1
        if (len === 1) {
          // 判断页码值是否为 1，如果是 1 页码值不再减 1 ,再重新赋值
          q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
        }
        // 重新渲染表格
        initList()
      })
      layer.close(index)
    })
  })

  // 通过代理的方式为编辑按钮绑定点击事件
  $('tbody').on('click', '.btn-edit', function () {
    let id = $(this).attr('data-id')
    // 传参
    location.href = '/article/article_pub.html?id=' + id
  })

})
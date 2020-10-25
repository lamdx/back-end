$(function() {
  // 渲染订单类型选项
  EB.getOption("/order/v1/order_type", document.getElementById("orderType"));
  // 初始化查询日期，设置为系统当前日期时间的前30天
  $("#tstart").val(
    new Date(new Date().setDate(new Date().getDate() - 30)).format("yyyy-MM-dd")
  );
  // 当前页码
  var currentPage = 1;
  // 加载指定页数据
  function loadPage(page) {
    var $start = $("#tstart").val() || "2019-10-01";
    var $end =
      $('#tend').val() ||
      new Date(new Date().setDate(new Date().getDate() + 30)).format('yyyy-MM-dd');
    var $orderType = $("#orderType").val();
    var $orderNo = $("#orderNo").val() || 0;
    // $("tbody").fadeOut();
    $.ajax({
      type: "get",
      // url: "/order/v1/ordertime/2019-10-23&2019-10-24&1&0&" + page,
      url: `/order/v1/ordertime/${$start}&${$end}&${$orderType}&${$orderNo}&${page}`,
      dataType: "json",
      success: function(data) {
        // 动态总页数 调用destroy方法，然后使用新选项初始化它 数据增加删除有可能影响页数
        $(".pagination").twbsPagination("destroy");
        // 分页组件
        $(".pagination").twbsPagination({
          // 渲染分页页面组件
          initiateStartPageClick: false, // 插件初始化时在起始页面上点击，数据增加删除后点击页码依然能保证是当前页而不是起始页
          first: "首页",
          last: "末页",
          prev: "上一页",
          next: "下一页",
          startPage: page,
          totalPages: Math.ceil(data.total_pages) || 1,
          visiblePages: 5,
          onPageClick: function(e, page) {
            // 点击分页页码才会执行这里的代码
            loadPage(page);
            currentPage = page;
          }
        });
        var res = template("tmpl_list", { orderlist: data.orderlist });
        $("tbody")
          .html(res)
          .fadeIn();
      }
    });
  }
  loadPage(currentPage);
  $("form .btn").on("click", function(event) {
    event.preventDefault();
    // 每次搜索重新加载第1页
    loadPage(1);
  });
  // 批准
  $("tbody").on("click", ".btn-info", function(e) {
    e.preventDefault();
    var $status = 3;
    var $no = $(this)
      .parent()
      .siblings("[data-no]")
      .data("no");
    console.log($no);
    $.ajax({
      type: "get",
      url: `/order/v1/updatestatus/${$no}&${$status}`,
      dataType: "json",
      success: function(data) {
        if (data == 1) {
          loadPage(currentPage);
        }
      }
    });
  });
  // 拒绝
  $("tbody").on("click", ".btn-warning", function(e) {
    e.preventDefault();
    var $status = 1;
    var $no = $(this)
      .parent()
      .siblings("[data-no]")
      .data("no");
    console.log($no);
    $.ajax({
      type: "get",
      url: `/order/v1/updatestatus/${$no}&${$status}`,
      dataType: "json",
      success: function(data) {
        if (data == 1) {
          loadPage(currentPage);
        }
      }
    });
  });
});

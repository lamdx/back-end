$(function() {
  // 渲染订单类型选项
  EB.getOption("/order/v1/order_type", document.getElementById("orderType"));
  // 渲染承运商选项
  EB.getOption("/order/v1/fwd", document.getElementById("fwd"));
  // 初始化查询日期，设置为系统当前日期时间的前30天
  $("#tstart").val(
    new Date(new Date().setDate(new Date().getDate() - 30)).format("yyyy-MM-dd")
  );
  var modalHtml = [
    '<div class="modal fade" id="update" tabindex="-1">',
    '  <div class="modal-dialog">',
    '    <div class="modal-content">',
    '      <div class="modal-header">',
    '        <h5 class="modal-title" id="exampleModalLabel">温馨提示</h5>',
    '        <button type="button" class="close" data-dismiss="modal">',
    "          <span>&times;</span>",
    "        </button>",
    "      </div>",
    '      <div class="modal-body">',
    "        派车成功，是否继续？",
    "      </div>",
    '      <div class="modal-footer">',
    "        <button",
    '          type="button"',
    '          class="btn btn-secondary"',
    '          data-dismiss="modal"',
    "        >",
    "          否",
    "        </button>",
    '        <button type="button" class="btn btn-primary">',
    "          是",
    "        </button>",
    "      </div>",
    "    </div>",
    "  </div>",
    "</div>"
  ].join("");
  $("body").append(modalHtml);

  // 根据订单号查询到相应的信息
  $("[class='btn btn-primary mx-sm-2 mb-0']").on("click", function(event) {
    event.preventDefault();
    var $start = $("#tstart").val() || "2019-10-01";
    var $end = $("#tend").val() || "2019-12-31";
    var $orderType = $("#orderType").val();
    var $orderNo = $("#orderNo").val();
    var $page = 1;
    // 如果没有输入订单号，就返回false
    if (!$orderNo) {
      return false;
    }
    $.ajax({
      type: "get",
      url: `/order/v1/ordertime/${$start}&${$end}&${$orderType}&${$orderNo}&${$page}`,
      dataType: "json",
      success: function(data) {
        // console.log(data);
        var $obj = data.orderlist[0];
        $(".updatelist").removeClass("invisible");
        $(".updatelist #sname").val($obj.sname);
        $(".updatelist #sphone").val($obj.sphone);
        $(".updatelist #fwd").val($obj.fwd);
        $(".updatelist #gweight").val($obj.gweight);
        $(".updatelist #gvolume").val($obj.gvolume);
        $(".updatelist #tNumber").val($obj.tNumber);
        $(".updatelist [name='orderNo']").val($obj.orderNo);
      }
    });
  });

  // 更新订单
  var updateOrder = function() {
    return new Promise((resolve, reject) => {
      var $status = 4;
      var $deliveryTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      var $data =
        $(".updatelist .form-inline").serialize() +
        `&status=${$status}&deliveryTime=${$deliveryTime}`;
      $.ajax({
        type: "put",
        url: "/order/v1/updateorder",
        data: $data,
        dataType: "json",
        success: data => resolve(data),
        error: data => reject(data)
      });
    });
  };

  // 给按钮注册点击事件提交更改信息
  $(".updatelist .btn").on("click", function(event) {
    event.preventDefault();
    updateOrder().then(function(data) {
      // 修改成功
      if (data == 1) {
        var $update = $("#update"); // 模态框组件对象
        $update
          .modal("show")
          .find(".btn-primary")
          .on("click", function(e) {
            $update.modal("hide");
            /*跳转登录*/
            location.href = location.href;
          });
        // 点击否按钮事件
        $update.on("hidden.bs.modal", function(e) {
          // 将保存按钮变成文本信息
          $("#tips").html("<span>派车成功</span>");
        });
      }
    });
  });
});

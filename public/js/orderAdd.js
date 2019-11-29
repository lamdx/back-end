$(function() {
  // 渲染订单类型选项
  EB.getOption("/order/v1/order_type", document.getElementById("orderType"));
  // 渲染承运商选项
  EB.getOption("/order/v1/fwd", document.getElementById("fwd"));

  var modalHtml = [
    '<div class="modal fade" id="add" tabindex="-1">',
    '  <div class="modal-dialog">',
    '    <div class="modal-content">',
    '      <div class="modal-header">',
    '        <h5 class="modal-title" id="exampleModalLabel">温馨提示</h5>',
    '        <button type="button" class="close" data-dismiss="modal">',
    "          <span>&times;</span>",
    "        </button>",
    "      </div>",
    '      <div class="modal-body">',
    "        添加订单成功，是否继续添加？",
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

  // 生成订单号
  var getOrder = function() {
    return new Promise((resolve, reject) => {
      // WS191023023 PKS191023038
      // 获取订单类型和订单号
      var type = $("#orderType").val() ? $("#orderType").val() : 0;
      // console.log(type);
      // var no = orderNo.value ? orderNo.value : 0;
      var no = 0;
      // console.log(no);
      var page = 1;
      // var d1 = new Date("2019-10-23");
      // 将日期格式中的 / 改为 -
      var d1 = new Date().toLocaleDateString().replace(/\//g, "-");
      var d2 = new Date(d1);
      // 原日期加上1天
      d2.setDate(d2.getDate() + 1);
      d2 = d2.toLocaleDateString().replace(/\//g, "-");
      $.ajax({
        type: "get",
        url: `/order/v1/ordertime/${d1}&${d2}&${type}&${no}&${page}`,
        data: "",
        dataType: "json",
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  };
  // 添加订单
  var addOrder = function() {
    return new Promise((resolve, reject) => {
      var $status = 2;
      var $orderTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      // console.log($(".form-inline").serialize());
      var $data =
        $(".form-inline").serialize() +
        `&status=${$status}&orderTime=${$orderTime}`;
      // console.log(typeof $data);
      // console.log($data);
      $.ajax({
        type: "post",
        url: "/order/v1/orderadd",
        data: $data,
        dataType: "json",
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  };

  // 给按钮注册点击事件
  $(".form-inline .btn-primary").on("click", function(event) {
    event.preventDefault();
    // 保证添加订单前先获取到订单号
    getOrder()
      .then(function(data) {
        // 数据库没有返回订单号就根据当天系统日期初始化订单号
        if (data.orderlist.length == 0) {
          var now = new Date();
          var year = now
            .getFullYear()
            .toString()
            .substring(2);
          var month = (now.getMonth() + 1).toString().padStart(2, "0");
          var day = now
            .getDate()
            .toString()
            .padStart(2, "0");
          orderNo.value = "WS" + year + month + day + "001";
          console.log(orderNo.value);
        } else {
          // 获取数据库返回的数据
          var oldno = data.orderlist[0].orderNo;
          console.log(oldno);
          var temp = "";
          var current = "";
          // 判断返回的字符串以什么开头
          if (oldno.indexOf("WS") > -1) {
            var temp = oldno.substring(0, 8);
            var current = (parseInt(oldno.substring(8)) + 1)
              .toString()
              .padStart(3, "0");
            // oldno.substring(0,8)
            orderNo.value = temp + current;
            // console.log(orderNo.value);
          } else {
            var temp = oldno.substring(0, 9);
            var current = (parseInt(oldno.substring(9)) + 1)
              .toString()
              .padStart(3, "0");
            orderNo.value = temp + current;
            // console.log(orderNo.value);
          }
        }
        return addOrder();
      })
      .then(function(data) {
        console.log(data);
        if (data == 1) {
          var $add = $("#add");
          $add
            .modal("show")
            .find(".btn-primary")
            .on("click", function(e) {
              $add.modal("hide");
              /*跳转登录*/
              location.href = location.href;
            });
          // 点击否按钮事件
          $add.on("hidden.bs.modal", function(e) {
            $("#tips").html("<span>添加订单成功</span>");
          });
        }
      });
  });
});

$(function() {
  var modalHtml = [
    '<div class="modal fade" id="updatepwd" tabindex="-1">',
    '  <div class="modal-dialog">',
    '    <div class="modal-content">',
    '      <div class="modal-header">',
    '        <h5 class="modal-title" id="exampleModalLabel">温馨提示</h5>',
    '        <button type="button" class="close" data-dismiss="modal">',
    "          <span>&times;</span>",
    "        </button>",
    "      </div>",
    '      <div class="modal-body">',
    "        密码修改成功，请重新登录！",
    "      </div>",
    '      <div class="modal-footer">',
    '        <button type="button" class="btn btn-primary">确定</button>',
    "      </div>",
    "    </div>",
    "  </div>",
    "</div>"
  ].join("");
  $("body").append(modalHtml);

  function updateuser() {
    var $formdata = $("#login_form").serialize();
    $.ajax({
      type: "put",
      url: "/user/v1/updateuser",
      data: $formdata,
      dataType: "json",
      success: function(data) {
        var $msg = $("#msg");
        if (data == 1) {
          var $updatepwd = $("#updatepwd");
          $updatepwd.on("hidden.bs.modal", function(e) {
            // 退出登录，清除session，并跳转到登录页
            EB.logout();
          });
          $updatepwd
            .modal("show")
            .find(".btn-primary")
            .on("click", function(e) {
              $updatepwd.modal("hide");
              // 退出登录，清除session，并跳转到登录页
              EB.logout();
            });
        } else if (data == -1) {
          $msg.html("原密码没有填写");
        } else if (data == -2) {
          $msg.html("新密码没有填写");
        } else if (data == -3) {
          $msg.html("确认密码没有填写");
        } else if (data == -4) {
          $msg.html("新密码不能与旧密码一致");
        } else {
          $msg.html("原密码填写错误");
        }
      }
    });
  }

  $("#login_form .btn").on("click", function(e) {
    e.preventDefault();
    updateuser();
  });
});

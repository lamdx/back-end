$(function() {
  var modalHtml = [
    '<div class="modal fade" id="register" tabindex="-1">',
    '  <div class="modal-dialog">',
    '    <div class="modal-content">',
    '      <div class="modal-header">',
    '        <h5 class="modal-title" id="exampleModalLabel">温馨提示</h5>',
    '        <button type="button" class="close" data-dismiss="modal">',
    "          <span>&times;</span>",
    "        </button>",
    "      </div>",
    '      <div class="modal-body">',
    "        注册成功，请登录！",
    "      </div>",
    '      <div class="modal-footer">',
    '        <button type="button" class="btn btn-primary">确定</button>',
    "      </div>",
    "    </div>",
    "  </div>",
    "</div>"
  ].join("");
  $("body").append(modalHtml);
 
  var $msg = $("#msg");

  $("#eid").change(function(e) {
    checkEid();
  });
  // 检查用户是否已经存在
  function checkEid() {
    var $eid = $("#eid").val();
    var xhr = new XMLHttpRequest();
    xhr.open("get", "/user/v1/checkeid/" + $eid, true);
    if (!$eid) {
      return $msg.html("用户名没有填写");
    }
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var res = xhr.responseText;
        if (res == 0) {
          $msg.html("此用户已经存在");
        } else {
          $msg.html("用户名合法");
        }
      }
    };
  }

  // 检查登录密码和确认密码是否一致且都不为空
  $("#pwd").blur(function(e) {
    checkPwd();
  });
  $("#cpwd").blur(function(e) {
    checkCpwd();
  });

  function checkPwd() {
    if (pwd.value.length == 0) {
      $msg.html("密码不能为空");
    } else if (pwd.value == cpwd.value) {
      $msg.html("密码一致");
    } else if (pwd.value != cpwd.value && cpwd.value.length != 0) {
      $msg.html("两次输入的密码不一致");
    }
  }

  function checkCpwd() {
    if (cpwd.value.length == 0) {
      $msg.html("密码验证不能为空");
    } else if (cpwd.value == pwd.value) {
      $msg.html("密码一致");
    } else if (cpwd.value != pwd.value && pwd.value.length != 0) {
      $msg.html("两次输入的密码不一致");
    }
  }

  // 给按钮绑定注册用户事件
  $(".form-signin .btn").on("click", function(e) {
    e.preventDefault();
    var $formdata = $(".form-signin").serialize();
    console.log($formdata);
    $.ajax({
      type: "post",
      url: "/user/v1/reguser",
      data: $formdata,
      dataType: "json",
      success: function(data) {
        if (data == 1) {
          var $register = $("#register");
          $register.on("hidden.bs.modal", function(e) {
            window.location.href = "login.html";
          });
          $register
            .modal("show")
            .find(".btn-primary")
            .on("click", function(e) {
              $register.modal("hide");
              window.location.href = "login.html";
            });
        } else if (data == 0) {
          $msg.html("此用戶/手机号码已经存");
        } else if (data == -1) {
          $msg.html("工号没有填写");
        } else if (data == -2) {
          $msg.html("密码没有填写");
        } else if (data == -3) {
          $msg.html("确认密码没有填写");
        } else if (data == -4) {
          $msg.html("邮箱没有填写");
        } else if (data == -5) {
          $msg.html("手机没有填写");
        } else if (data == -6) {
          $msg.html("真实姓名没有填写");
        } else {
          $msg.html("注册失败");
        }
      }
    });
  });
});

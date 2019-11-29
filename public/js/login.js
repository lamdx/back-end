$(function() {
  // 给登录按钮添加点击事件，点击登录，处理逻辑
  $(".btn").on("click", function(e) {
    e.preventDefault();
    login();
  });
  function login() {
    var $eid = $("#eid").val();
    var $pwd = $("#pwd").val();
    if (!$eid) {
      return $("#msg").html("用户名不能为空");
    }
    if (!$pwd) {
      return $("#msg").html("密码不能为空");
    }
    $.ajax({
      type: "get",
      url: `/user/v1/login/${$eid}&${$pwd}`,
      dataType: "json",
      success: function(data) {
        if (data == 1) {
          // $('#msg').html("登录成功";
          window.location.href = "index.html";
        } else if (data == 0) {
          $("#msg").html("用户名或者密码错误");
        }
      }
    });
  }

  // 还需要做一个快捷键登录
  $(document).keyup(function(event) {
    // 判断event的值keyCode的值，如果这个keyCode的值等于13 ，说明用户按的是enter键
    if (event.keyCode == 13) {
      login();
    }
  });
});

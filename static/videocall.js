$(document).ready(function() {
  $("#videocall").html("<iframe src=\"https://meet.jit.si//"+videoCallID+"\" allow=\"camera;microphone\"></iframe>");
  if (location.href.includes("https://chat.koyu.space/chat")) {
    try {
      $.get("/api/v1/login2/"+localStorage.getItem("username")+"/"+localStorage.getItem("uuid")+"/"+localStorage.getItem("instance"), function(data) {
          if (data["login"] !== "ok") {
              location.href = "/";
          }
      });
    } catch (e) {}
  } else {
    try {
      $.get("/api/v1/login2/"+localStorage.getItem("username")+"/"+localStorage.getItem("uuid")+"/"+localStorage.getItem("instance"), function(data) {
          if (data["login"] === "ok") {
              location.href = "/chat";
          }
      });
    } catch (e) {}
  }

  $("#logout").click(function() {
    localStorage.clear();
    window.setTimeout(function() {
      location.href = "/";
    }, 200);
  });

  $("#username").keypress(function (e) {
    if (e.which === 13) {
      $("#kslogin").click();
      return false;
    }
  });
  
  $("#password").keypress(function (e) {
      if (e.which === 13) {
        $("#kslogin").click();
        return false;
      }
  });

  $("#kslogin").click(function() {
    //Blocking gab, don't judge me
    if ($("#instance").val().toLowerCase().includes("gab.com") || $("#instance").val().toLowerCase().includes("gab.ai")) {
        $("#kslogin").removeAttr("disabled");
        $("#kslogin").html(oldHTML);
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_system');
        return false;
    } else {
        $("#welcome__error").hide();
        $("#kslogin").attr("disabled", "");
        var oldHTML = $("#kslogin").html();
        $("#kslogin").html("<img src=\"/static/loading.svg\" height=\"16\" style=\"vertical-align:middle;margin-top:-3px;\" /> "+$("#kslogin").html());
        window.setTimeout(function() {
            $.post("/api/v1/login", {username: $("#username").val(), password: $("#password").val(), instance: $("#instance").val()}, function(data) {
                if (data["login"] === "ok") {
                    localStorage.setItem("uuid", data["uuid"]);
                    localStorage.setItem("username", $("#username").val());
                    localStorage.setItem("instance", $("#instance").val());
                    window.setTimeout(function() {
                        location.href = "/chat";
                    }, 200)
                } else {
                    $("#kslogin").removeAttr("disabled");
                    $("#kslogin").html(oldHTML);
                    $("#welcome__error").show();
                }
            }).fail(function() {
                $("#kslogin").removeAttr("disabled");
                $("#kslogin").html(oldHTML);
                $("#welcome__error").show();
            });
        }, 1000)
    }
  });
});
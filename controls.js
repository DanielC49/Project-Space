let thrust = 0,
    steer = 0,
    zoom = 0.5;

$(document).ready(function() {

  let change_thrust = false, change_steer = false, change_zoom = false, x0, y0;

  $("#thrust-slider").on("mousedown", function() {
    change_thrust = true;
    $("#thrust-slider-handle").css("background-color", "rgb(160, 160, 160");
  });

  $("#steer-slider").on("mousedown", function() {
    change_steer = true;
    $("#steer-slider-handle").css("background-color", "rgb(160, 160, 160");
  });

  $("#zoom-slider").on("mousedown", function() {
    change_zoom = true;
    $("#zoom-slider-handle").css("background-color", "rgb(160, 160, 160");
  });

  $("body").on("mouseup", function() {
    change_thrust = false;
    change_steer = false;
    change_zoom = false;
    x0 = undefined;
    y0 = undefined;
    $("#thrust-slider-handle").css("background-color", "rgb(140, 140, 140");
    $("#steer-slider-handle").css("background-color", "rgb(140, 140, 140");
    val = 85;
    $("#steer-slider-handle").css("left", val);
    $("#steer-slider-value").text(Math.round(val / 170 * 100 - 50));
    steer = 0;
  });

  $("body").on("mousemove mousedown", function(e) {
    if (change_thrust) {
      if (!y0) y0 = e.pageY - $("#thrust-slider-handle").offset().top;
      val = e.pageY - $("#thrust-slider").offset().top - (y0 >= 0 && y0 <= 30 ? y0 : 15);
      if (val < 0) val = 0;
      if (val > 170) val = 170;
      $("#thrust-slider-handle").css("top", val);
      $("#thrust-slider-value").text(Math.round(100 - val / 170 * 100) + " %");
      thrust = Number(Number(1 - val / 170).toFixed(2));
    } else if (change_steer) {
      if (!x0) x0 = e.pageX - $("#steer-slider-handle").offset().left;
      val = e.pageX - $("#steer-slider").offset().left - (x0 >= 0 && x0 <= 30 ? x0 : 15);
      if (val < 0) val = 0;
      if (val > 170) val = 170;
      $("#steer-slider-handle").css("left", val);
      $("#steer-slider-value").text(Math.round(val / 170 * 100 - 50));
      steer = Number(Number(val / 170 - 0.5).toFixed(2));
    } else if (change_zoom) {
      if (!y0) y0 = e.pageY - $("#zoom-slider-handle").offset().top;
      val = e.pageY - $("#zoom-slider").offset().top - (y0 >= 0 && y0 <= 30 ? y0 : 15);
      if (val < 0) val = 0;
      if (val > 170) val = 170;
      $("#zoom-slider-handle").css("top", val);
      //Math.log(val / 170 - 0.5);
      $("#zoom-slider-value").text(Math.round(100 - val / 170 * 100) + " %");
      zoom = 1 - val / 170;
    }
  });

});

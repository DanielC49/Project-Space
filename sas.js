function sasRefresh() {
  if (rocket.rotV > 0)
    steer = -0.5; //1 - Math.abs(rocket.rotV - 0);
  else if (rocket.rotV < -0)
    steer = 0.5; //Math.abs(rocket.rotV - 0) + 0.5;
  else
  steer = 0;

  /*if (rocket.rotP > 1)
    $("#steering-slider").val(10 - 1 * Math.abs(rocket.rotV - 0));
  else if (rocket.rotP < -1)
    $("#steering-slider").val(1 * Math.abs(rocket.rotV - 0) + 10);
  else
  $("#steering-slider").val(10);*/
}

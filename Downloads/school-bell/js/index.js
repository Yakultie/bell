// Timetable constructor, including the arrays of bus times
var Timetable = function(){
  var campusMF = ["08:30", "09:20", "10:25", "11:35", "12:30", "13:25", "14:25", "15:25", "16:35", "17:30"];
  var campusSA = [];
  var campusSU = [];
  var leamMF = ["06:40", "07:00", "07:20"];
  var campusSA = [];
  var campusSU = [];
  var leamMF = ["06:52", "07:14", "07:21", "07:36", "07:48", "07:58", "08:06", "08:08", "08:13", "08:38", "08:45", "08:58", "09:02", "09:11", "09:23", "09:32", "09:44", "09:56", "10:08", "10:19", "10:34", "10:49", "11:04", "11:19", "11:34", "11:49", "12:04", "12:19", "12:34", "12:49", "13:04", "13:19", "13:34", "13:49", "14:04", "14:19", "14:34", "14:49", "15:04", "15:19", "15:39", "15:56", "16:12", "16:34", "16:46", "17:02", "17:16", "17:28", "17:40", "17:50", "18:09", "18:27", "18:31", "18:54", "19:01", "19:16", "19:31", "19:34", "19:54", "20:14", "20:34", "20:54", "21:14", "21:34", "21:54", "22:14", "22:34", "22:54", "23:14", "23:34", "00:31"];
  var leamSA = [];
  var leamSU = [];
  
  var today = new Date().toUTCString().slice(0, 16);
  
  // Convert time strings to actual dates (doesn't work past midnight yet)
  for(var i=0, l=campusMF.length; i<l; i++){
    campusMF[i] = new Date(today+" "+campusMF[i]);
  }
  for(var i=0, l=leamMF.length; i<l; i++){
    leamMF[i] = new Date(today+" "+leamMF[i]);
  }
  
  // This will be where we work out what timetable to use
  var campus = campusMF;
  var leam = leamMF;
  
  // A variable for updating the time left automatically
  var update = setTimeout($.noop, 0);
  
  // The body of the Timetable object, returns a HTML string
  // that will look nice on the page containing the time til
  // the next bus at the given stop ('c' or 'l');
  this.next = function(place){
    clearTimeout(update); //Updating now so cancel the planned one
    if(place == "l")
      var times = leam;
    else
      times = campus;
    var now = new Date();
    var d; // Time to wait in mins
    var next = '<span id="time">';
    for(var i=0, l=times.length; i<l; i++){
      if(times[i].getTime() >= now.getTime()){
        d = (times[i].getTime()-now.getTime())/(1000*60);
        if(d >= 60)
          next += Math.floor(d/60)+"</span>hours and "+Math.round(d % 60)+" mins";
        else
          next += Math.round(d)+"</span> mins";
        break;
      }
    }
    var fn = arguments.callee;
    var _this = this;
    update = setTimeout(function(){
      document.getElementById('info').innerHTML = fn.call(_this, place);
    },(d+0.5-Math.floor(d+0.5))*60*1000+1000);
    // The time here makes it so an update happens at just gone 30
    // seconds past each minute (when round actually changes the value)
    return next;
  }
}

// Lets use what we've built!
var timetable = new Timetable();

// Update the screen even if jquery isn't available for some reason
document.onready = function(){
  document.getElementById('info').innerHTML = timetable.next('c');
}


$(document).ready(function(){
    $('#c').click(function(){
      if($(this).hasClass('active'))
        return;
      document.getElementById('info').innerHTML = timetable.next('c');
      $(this).addClass('active')
             .siblings().removeClass('active');
    });
    $('#l').click(function(){
      if($(this).hasClass('active'))
        return;
      document.getElementById('info').innerHTML = timetable.next('l');
      $(this).addClass('active')
             .siblings().removeClass('active');
    });
});
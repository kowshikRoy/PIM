var scoreDictionary = {};
var pointOfCandidate = {};


var jobs = alasql('select * from job');
console.log(jobs);
var job_select = $('#job-select');
for(var i = 0; i < jobs.length; i ++) {
    var position_name= alasql('select * from position where id = ?', [jobs[i].position])[0].position;
    console.log(position_name);
    job_select.append('<option value ="'+ jobs[i].id + '" >#' + jobs[i].id + '-' + position_name + '</option>')
}

$("#skills").html('');

var skills = alasql('select distinct skill from card');
var list = $('<ul class="list-group"></ul>');
for (var i = 0; i < skills.length; i++) {
    list.append('<li data-name="' + skills[i].skill + '"class="list-group-item">' + skills[i].skill + '<br><br><div class="slider"><div class="ui-slider-handle"></div></div>' + '</li>');
}
$("#skills").html(list);
$('#skills').append('<strong>Set threshold</strong><br><br>');
$('#skills').append('<div id="threshold"><div class="ui-slider-handle"></div></div>');
$('#threshold').slider({
    value:40,
    max:100,
    create: function () {
        $(this).find('.ui-slider-handle').text($(this).slider("value"));
        scoreDictionary['threshold'] = $(this).slider('value');
    },
    slide: function (event, ui) {
        $(this).find('.ui-slider-handle').text(ui.value);
    },
    change: function () {
        scoreDictionary['threshold'] = $(this).slider('value');
        loadCompare();
    }
});
    
$('#skills .slider').each(function () {
    var handle = $(this).find('.ui-slider-handle');
    $(this).slider({
        value: 70,
        max: 100,
        create: function () {
            handle.text($(this).slider("value"));
            scoreDictionary[$(this).closest('li').attr('data-name')] = $(this).slider('value');
        },
        slide: function (event, ui) {
            handle.text(ui.value);
        },
        change: function () {
            $('.slider').each(function(){
                // console.log($(this).closest('li').attr('data-name'));
                // console.log($(this).slider('value'));
                scoreDictionary[$(this).closest('li').attr('data-name')] = $(this).slider('value');
            });
            // getComputed([4,13])
            loadCompare();
        }
    });
});

loadCompare();

function loadCompare(){
    $('#content').html('');
    var jobid = parseInt($('#job-select').val());
    if(jobid == 0) return
    var applicants = alasql('select * from application where isactive = 1 and jobid = ?', [jobid]);
    var dict = {}
    for(var i = 0; i < applicants.length ; i ++ ) {
        var appid = applicants[i].id;
        var steps = alasql('select * from feedback where jobid = ? and appid = ?', [jobid, appid]);

        console.log(steps);
        var res = 0;
        for(var k = 0; k < steps.length; k ++) if(steps[k].stepid > res) res = steps[k].stepid;
        console.log(res);

        if(res in dict) dict[res].push(appid);
        else dict[res] = [appid];
    }

    var keys = Object.keys(dict);
    var numbers = []
    for(var i = 0; i < keys.length; i ++ ) numbers.push(parseInt(keys[i]));
    console.log(numbers);
    numbers = numbers.sort(function(a,b){ return a < b;});
    
    
    for(var i = 0; i < numbers.length ; i ++)  {
        var len = numbers[i];
        var list = dict[len];

        var out = getComputed(list);

        $('#content').append(generateListFromApplication(out));
    } 
}
// $('#checkslider').slider();



function getComputed(appids)
{
    console.log(scoreDictionary);
    for(var i = 0; i < appids.length ; i ++ ){
        var app = alasql('select * from application where id = ?', [appids[i]])[0];
        var appComplete = alasql('select * from feedback where jobid= ? and appid = ? order by stepid',[app.jobid, app.id]);
        var sum = 0;
        var div = 0;
        for(var j = 0; j < appComplete.length; j ++) {
            var ratingid = appComplete[j].ratingid;
            var ratings = alasql('select * from rating where id= ?', [ratingid]);
            for(var k = 0;k < ratings.length; k ++) {
                var skill= ratings[k].skill;
                var point = scoreDictionary[skill];

                if(ratings[k].rating < scoreDictionary['threshold']) sum += (ratings[k].rating- scoreDictionary['threshold']/10)* point;
                else sum += ratings[k].rating * point;
                div += point;
            }
        }
        pointOfCandidate[appids[i]] = sum / div;
    }
    console.log(pointOfCandidate);
    appids =  appids.sort(function(a,b){return pointOfCandidate[b] - pointOfCandidate[a]});
    console.log(appids);
    return appids;
}



function buttonInterview(app)
{
  var jobid = app.jobid;
  var steps = alasql('select * from pipeline where jobid = ? order by stepid',[jobid]);
  var appComplete = alasql('select * from feedback where jobid= ? and appid = ? order by stepid',[jobid, app.id]);

  var myset= new Set();
  for(var i = 0; i < appComplete.length;  i ++) myset.add(appComplete[i].stepid);
  console.log(myset, app, steps);

  var out = "";
  for(var i = 0; i < steps.length; i ++) {
    var pipe = steps[i].stepid;
    console.log(pipe);
    var newString = "";
    if(myset.has(pipe)) {
        
      newString = '<button onclick="showFeedbackModal(this)" data-jobid="'+ app.jobid + '" data-appid="'+ app.id + '" data-stepid="' + pipe + '"  class="btn btn-success">' + alasql('select * from step where id = ?',[pipe])[0].name + '</button>';
    }
    else {
      if(app.isactive == 0) newString = '<button class="btn btn-danger">' + alasql('select * from step where id = ?',[pipe])[0].name + '</button>';

      else newString = '<button class="btn btn-default">' + alasql('select * from step where id = ?',[pipe])[0].name + '</button>';
    } 

    out += newString;
  }
  return out;
}

function showFeedbackModal(e)
{
  var jobid = parseInt($(e).attr('data-jobid'));
  var appid = parseInt($(e).attr('data-appid'));
  var stepid = parseInt($(e).attr('data-stepid'));

  console.log(jobid, appid, stepid);
  var row = alasql('select * from feedback where jobid = ? and appid = ? and stepid= ?', [jobid, appid, stepid])[0];

  var ratingid = row.ratingid;
  var comment = row.comment;

  console.log(comment);
  console.log(ratingid);
  var result = alasql('select * from rating where id = ?',[ratingid]);

  $('#feedback-modal').modal('show');
  var list = $('<ul class="list-group"></ul>');
  for(var i = 0; i < result.length; i ++) {
    var li = '<li class="list-group-item">' + result[i].skill + ' - ' + result[i].rating +'</li>';
    list.append(li);
  }
  $('#feedback-candidate').html(list);
  $('#feedback-candidate').append('<strong>Notes</strong>');
  $('#feedback-candidate').append('<p>' + comment + '</p>');
}


function generateListFromApplication(arr)
{
    var list = $('<ul class="list-group"></ul>');
    
    for(var i= 0; i < arr.length; i ++) {
      var app = alasql('select * from application where id = ?', [arr[i]])[0];
    
      var li = '<li class="list-group-item">\
      <div class="row">\
          <div class="col-md-2">' + app.id + ' ' + app.name + '</div> \
          <div class="col-md-9"> \
                  <div class="btn-group btn-group-sm" role="group" aria-label="...">' 
                  + buttonInterview(app) +
                  '</div>\
            </div> \
            <div class="col-md-1">' + parseFloat(Math.round(pointOfCandidate[app.id] * 100) / 100).toFixed(2); + '</div>\
          </div>\
      </div> </li>';
        list.append(li);
    }
    return list;

}


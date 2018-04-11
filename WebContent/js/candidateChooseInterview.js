var canid = parseInt($.url().param('id'));
var application = alasql('select * from application where id = ?',[canid])[0];

var intreq = alasql('select * from interviewRequest where appid = ?',[canid]);
var scheduleInterview = alasql('select * from scheduleInterview where appid = ?',[canid]);
if(intreq.length > 0 || scheduleInterview.length > 0) $('#tab-calendar').html('');

if(scheduleInterview.length > 0) {
    var interview = scheduleInterview[0];
    $('#in1 .panel-body').html('<p>' + new Date(interview.time).toString() + '</p>');
}
else if(intreq.length > 0){
    for(var i = 0; i < intreq.length ; i ++) {
        $('#in2 .panel-body').append('<p>' + new Date(intreq[i].time).toString() + '</p>');
    }
}
else {
    displaySlot();
}
$('#welcome').text('Welcome #' + application.id + ' - ' + application.name);



var today = new Date();
var date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);


function displaySlot()
{
    var today =  new Date($('#chooseInterviewDate').val());
    console.log(today.toString());
    var closedate = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
    var jobid = application.jobid;

    var interviewers = alasql('select * from interview where jobid = ?',[jobid]);
    console.log(interviewers);

    $('#selector').html('');
    for(var i = 0; i < 24; i ++) {
        var time = today.setHours(i);
        console.log(time,new Date(time));
        var flag = 0;
        for(var j = 0; j < interviewers.length && !flag;  j ++) {
            var plans = alasql('select * from empplan where empid = ?',[interviewers[j].empid]);
            console.log(plans);
            for(var k = 0; k < plans.length && !flag; k ++ ) {
                if(plans[k].type == 'once') {
                    if(plans[k].st <= time && plans[k].ed > time) {
                        flag = 1;
                    }
                }
                else if(plans[k].type == 'daily') {
                    if(time < plans[k].st) continue;
                    var st = new Date(plans[k].st);
                    st = st.setDate(today.getDate());
                    console.log(st);

                    var ed = new Date(plans[k].ed);
                    ed = ed.setDate(today.getDate());
                    console.log(st,ed);

                    if(time >= st && time < ed) {
                        flag = 1;
                    }

                }
                else {
                    if(time < plans[k].st) continue;
                    var day = 1000*60*60*24;
                    var diff = Math.floor((time-plans[k].st)/(7*day));
                    var st = new Date(plans[k].st), ed = new Date(plans[k].ed);
                    st = st.setDate(st.getDate() + diff * 7);
                    ed = ed.setDate(ed.getDate() + diff * 7);

                    if(time >= st && time < ed) flag = 1;

                }
            }
        }
        if(flag) $('#selector').append('<div class="checkbox"> \
        <label><input type="checkbox" value="' + time + '">  ' + new Date(time).toString() + '</label></div>')

    }
}

function saveInterviewChoice(e)
{
    $('#selector input:checkbox:checked').each(function(){
        var id = alasql('SELECT MAX(id) + 1 as id FROM interviewRequest')[0].id;
        alasql('insert into interviewRequest values(?,?,?)', [id, canid, $(this).val()]);
    });
    window.location.reload();
    
}


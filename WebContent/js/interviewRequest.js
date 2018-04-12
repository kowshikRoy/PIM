var requests = alasql('select * from interviewRequest');
console.log(requests);
var tbody = $('#request-content tbody');

for(var i = 0; i < requests.length ; i ++) {
    var single = requests[i];
    var interviews = alasql ("select * from scheduleInterview where appid = ?",[single.appid]);
    if (interviews.length > 0) {
        continue;
    }

    var pendingReq = alasql("select * from pendingReq where appid = ? ",[single.appid]);
    if (pendingReq.length > 0) continue;


    var app = alasql('select * from application where id = ?',[single.appid])[0];
    var tr = $('<tr></tr>');
    tr.append('<td>' + single.id + '</td>');
    tr.append('<td>' + app.jobid + '</td>');
    tr.append('<td><a href="candidateInterviewDateChoice.html?id=' + app.id + '" >#' + app.id + '-' + app.name + '</a></td>');
    tr.append('<td>' + new Date(single.time).toString() + '</td>');
    console.log(tr);

    tbody.append(tr);
}

var reqbody = $('#request-waiting tbody');
var pendings = alasql('select * from pendingReq');
for(var i = 0; i < pendings.length ; i ++) {
    var single = pendings[i];
    var app = alasql('select * from application where id = ?',[single.appid])[0];
    var emp = alasql('select * from emp where id = ?',[single.empid])[0];
    var tr = $('<tr></tr>');
    tr.append('<td>' + single.intReqid + '</td>');
    tr.append('<td>' + app.jobid + '</td>');
    tr.append('<td><a href="candidateInterviewDateChoice.html?id="' + app.id + '">#' + app.id + '-' + app.name + '</a></td>');
    tr.append('<td>' + new Date(single.time).toString() + '</td>');
    tr.append('<td>#<a href="emp.html?id='+ single.empid+ '">' + single.empid + '-' +emp.name + '</a></td>');
    console.log(tr);
    reqbody.append(tr);
}


var sendrequestagain = alasql('select distinct * from sendAgainChoiceForm');
var out = $('#sendChooseForm .list-group');
for(var i = 0; i < sendrequestagain.length; i ++) {
    var appid = sendrequestagain[i].appid;
    var application = alasql('select * from application where id = ?', [appid])[0];
    out.append('<li class="list-group-item" data-id="' + application.id + '">' + application.name + '<button style="margin-left:900px;" class="btn btn-sm btn-warning" onclick="sendChoice(this)">Send</li>')
}


function sendChoice(e)
{
    var appid = parseInt($(e.closest('li')).attr('data-id'));
    alasql('delete from scheduleInterview where appid = ?',[appid]);
    alasql('delete from interviewRequest where appid = ?',[appid]);
    alasql('delete from sendAgainChoiceForm where appid = ?', [appid]);
    $(e).text('Sent').addClass('btn-success').removeClass('btn-warning');
    window.location.reload();
}



function processInterviewRequest() {
    var req = alasql("select * from interviewRequest order by time");
    var selectedForPending = new Set();
    var appliedCandidates = [];
    for (var i = 0; i < req.length; i++) {
        var single = req[i];
       
        console.log(single);
        var jobid = alasql( "select * from application where id = ?",[single.appid] )[0].jobid;

        console.log(jobid);

        // check if the candidate has scheduled an interview
        var interviews = alasql ("select * from scheduleInterview where appid = ?",[single.appid]);
        if (interviews.length > 0) {
            continue;
        }
        console.log(12);

        // check if the candidate has already pending request
        var pendingReq = alasql("select * from pendingReq where appid = ? ",[single.appid]);
        if (pendingReq.length > 0) continue;

        console.log(13);
        // check if the request has been declined by all the interviewer
        var interviewers = alasql("select * from interview where jobid = ?", [jobid ]);
        var declinedReq = alasql("select * from declinedInterview where intReqid = ?",[single.id]);
        console.log(declinedReq);

        appliedCandidates.push(single.appid);
        var scheduled = 0;
        for (var j = 0; j < interviewers.length; j++) {
            var fixedinterview = alasql('select * from scheduleInterview where empid = ? and time = ?', [interviewers[j].empid, single.time] );
            if(fixedinterview.length > 0) continue;
            var flag = 0;
            for (var k = 0; k < declinedReq.length; k++) {
                if (declinedReq[k].empid == interviewers[j].empid) {
                    flag = 1;
                }
            }
            console.log("flag",flag);

            if (flag) continue;
            var plans = alasql("select * from empplan where empid = ?", [interviewers[j].empid]);


            var time = single.time;
            var today = new Date(time);
            for (var k = 0; k < plans.length; k++) {
            if (plans[k].type == "once") {
                if (plans[k].st <= time && plans[k].ed > time) {
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

                if(flag) {
                    scheduled = 1;
                }
            }

            if(scheduled) {

                
                alasql('insert into pendingReq values(?,?,?,?)', [single.id, single.appid, interviewers[j].empid, time ]);
                selectedForPending.add(single.appid);
                break;
            }
        }
        console.log(scheduled);
    }

    var myset = new Set();
    console.log(appliedCandidates);

   for(var i = 0; i < appliedCandidates.length; i ++) {
       if( selectedForPending.has(appliedCandidates[i])) {

       }
       else myset.add(appliedCandidates[i]);
   }

   console.log(myset);
   for(let item of myset) {
       alasql('insert into sendAgainChoiceForm values(?)',[item]);
   }



    window.location.reload();
} 


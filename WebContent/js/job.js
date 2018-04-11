var q1 = parseInt($.url().param("id"));
$('#description #jobeditbtn').attr('href', 'jobedit.html?id=' + q1);
$('#description #gotojob').attr('href', 'form.html?jobid=' + q1);
console.log(q1);

if (q1) {
  var job = alasql("select * from job where id=?", [q1])[0];

  if (job) {
    $("#page404").hide();
    // job description
    $("#j-description .col-md-8").text(job.description);
    $('#job-dept').text(alasql('select * from department where id= ?', [job.dept])[0].dept);
    $('#job-employ').text(job.employment);
    $('#job-deadline').text(job.closedate);



    // interviewer populate
    populateInterviewer();

    // pipeline populate
    populateStep();

    // candidate populate
    var candidates = alasql("select * from application where jobid = ?", [q1]);

    for (var i = 0; i < candidates.length; i++) {}
  } else {
    $("#content").hide();
    $("#page404").html(
      '<h1>404</h1> <h4> Please use valid job id </h4> <a href="dashboard.html" class="btn btn-warning"> Go to Dashboard </a> '
    );
  }
} 
else {
  $("#content").hide();
  $("#page404").html(
    '<h1>404</h1> <h4> Please use valid job id </h4> <a href="dashboard.html" class="btn btn-warning"> Go to Dashboard </a> '
  );
}

/* ------------------------- Add interviewer -----------------------*/
function populateInterviewer(){
    var $interviewer = $("#j-interviewer");
    $('#j-interviewer').html('');
    var interviewer = alasql("select * from interview where jobid = ?", [q1]);
    var out = $('<ul class="list-group"> </ul>');
    for (var i = 0; i < interviewer.length; i++) {
      var empid = interviewer[i].empid;
      var employee = alasql("select * from emp where id = ?", [empid])[0];

      var indiv =
        '<li class = "list-group-item" id="' +
        empid +
        '"> \
                        <div class="row"> \
                            <div class="col-md-1"><img class="img-rounded" width="40" src="img/' +
        employee.id +
        '.jpg" > </div> \
                            <div class="col-md-10"> \
                                <a href = "emp.html?id=' +
        employee.id +
        '">' +
        employee.name +
        "</a> \
                                <br>" +
        alasql("select * from position where id = ?", [employee.position])[0]
          .position +
        '</div> \
                            <div class="col-md-1"> \
                                <button class="btn btn-danger btn-sm" onclick="deleteInterviewer(this)"><i class="fa fa-remove"></i></button> \
                            </div>\
                        </div> \
                        </li>';


      out.append(indiv);
    }
    $interviewer.append(out);

    if($('#myModal').is(':visible')) $('#myModal').modal('toggle');

}

function updateListOfEmp() {
    var interviewer = alasql("select * from interview where jobid = ?", [q1]);
    var emps = alasql("select * from emp");
    $("#add-interviewer tbody").html('');
    var tbody = $("#add-interviewer tbody");
    for (var i = 0; i < emps.length; i++) {
      var emp = emps[i];
      var tr = $('<tr id="emp-' + emp.id + '"></tr>');
      tr.append(
        '<td><img height=40 class="img-circle" src="img/' + emp.id + '.jpg"></td>'
      );
      tr.append(
        '<td><a href="emp.html?id=' + emp.id + '">' + emp.number + "</a></td>"
      );
      tr.append("<td>" + emp.name + "</td>");
      tr.append(
        "<td>" +
          alasql("select * from position where id=?", [emp.position])[0]
            .position +
          "</td>"
      );
      console.log(i);
      var added = 0;
      for (var j = 0; j < interviewer.length; j++) {
        if (interviewer[j].empid == emp.id) added = 1;
      }
  
      if (added)
        tr.append('<button class="btn btn-warning" disabled>Added</button>');
      else
        tr.append(
          '<button class="btn btn-success" onClick="addInterviewer(this)">Add</button>'
        );
      tr.appendTo(tbody);
    }
    
  }


function deleteInterviewer(e) {
  var id = parseInt(e.closest(".list-group-item").id);
  alasql("delete from interview where jobid = ? and empid = ?", [q1, id]);
  e.closest(".list-group-item").remove();
}


function addInterviewer(e) {
 var tr = parseInt(e.closest('tr').id.slice(4));
  alasql('insert into interview values(?,?);',[q1, tr]);
  $('#' + e.closest('tr').id + ' button' ).removeClass('btn-success').addClass('btn-warning').text('Added').attr('disabled',true);
}


/* ------------------------- Add Pipeline -------------------------------*/

function populateStep() {
    var pipe = $("#j-pipeline");
    $('#j-pipeline').html('');

    var out = $('<ul class="list-group"> </ul>');
    var steps = alasql('select * from pipeline where jobid = ? order by stepid',[q1]);
    
    for(var i = 0; i < steps.length ; i ++) {
        var name = alasql('select * from step where id = ?',[steps[i].stepid])[0].name;
        var className, str;
        var temp = alasql('select * from pipeline where jobid= ? and stepid = ?', [q1, steps[i].stepid])[0];
        if(temp.cardid > 0) 
            className= "btn-success", str = alasql('select * from card where id = ?', [temp.cardid])[0].name;
        else className = "btn-warning", str = "Add Scorecard";


        var indiv =
        '<li class = "list-group-item" id="step' + steps[i].stepid +'"> \
            <div class="row"> \
                <div class="col-md-5">' + name + '</div> \
                <div class="col-md-3"> <button onclick="editCard(this)" class="btn btn-sm btn-block ' + className + '">' + str + '</button></div> \
                <div class="col-md-offset-3 col-md-1"> \
                    <button class="btn btn-danger btn-sm" onclick="deleteStep(this)"><i class="fa fa-remove"></i></button> \
                </div>\
            </div> \
        </li>';
        
      out.append(indiv);
    }
    pipe.append(out);
    if($('#pipeline-modal').is(':visible')) $('#pipeline-modal').modal('toggle');
}
function deleteStep(e) {
    var id = parseInt(e.closest(".list-group-item").id.slice(4));
    alasql("delete from pipeline where jobid = ? and stepid = ?", [q1, id]);
    e.closest(".list-group-item").remove();
  }


function updateListOfStep()
{
    var already = alasql("select * from pipeline where jobid = ?", [q1]);
    console.log(already);
    var all = alasql("select * from step");
    $("#j-step-modal tbody").html('');
    var tbody = $("#j-step-modal tbody");
    for (var i = 0; i < all.length; i++) {
      var step = all[i];
      var tr = $('<tr id="step-modal-' + step.id + '"></tr>');
      tr.append("<td>" + step.name + "</td>");

      
      var added = 0;
      for (var j = 0; j < already.length; j++) {
        if (already[j].stepid == step.id) added = 1;
      }
  
      if (added)
        tr.append('<button class="btn btn-warning btn-sm" disabled>Added</button>');
      else
        tr.append(
          '<button class="btn btn-success btn-sm" onClick="addStep(this)">Add</button>'
        );
      tr.appendTo(tbody);
    }
}

function addStep(e) {
    
    var tr = parseInt(e.closest('tr').id.slice(11))
    console.log(tr);
     alasql('insert into pipeline values(?,?,?);',[q1, tr,0]);
     $('#' + e.closest('tr').id + ' button' ).removeClass('btn-success').addClass('btn-warning').text('Added').attr('disabled',true);
   }

function editCard(e) {
    var id = parseInt(e.closest('li').id.slice(4));
    $('#step-select-modal').modal('show').attr('data-info', id);
    $('#step-select').html('');
    var temp = alasql('select * from pipeline where jobid= ? and stepid = ?', [q1, id])[0];

    var cards = alasql('select distinct id from card');
    var dept_select = $('<select class="form-control" id ="stepId-for-modal"' + id + '" > </select>');
    for(var i = 0; i < cards.length ; i ++) {
        var option = '<option value = ' + cards[i].id + '> ' + alasql('select * from card where id=?',[cards[i].id])[0].name + '</option>';
        dept_select.append(option);
    }
    $('#step-select').html(dept_select);

    dept_select.bind('change', function(e) {
        var cardid = parseInt($('#step-select select').val());
        var skills = alasql('select * from card where id = ? ',[cardid]);
        var list = $('<ul classs="list-group" style="padding:5px"> </ul>');
        for(var i = 0; i < skills.length; i ++) {
            list.append('<li class="list-group-item">' + skills[i].skill + '</li>');
        }
        $('#description-for-card').html(list);
    });   
}

function saveCard(e) {
    var stepid = parseInt($('#step-select-modal').attr('data-info'));
    var cardid = parseInt($('#step-select-modal select').val());
    console.log(stepid, q1, cardid);
    alasql('update pipeline set cardid = ? where jobid = ? and stepid = ?', [cardid, q1, stepid]);
    populateStep();
    if($('#step-select-modal').is(':visible')) $('#step-select-modal').modal('toggle');
}

function processInterviewRequest() {
	var req = alasql('select * from interviewRequest order by time');
	var interviewers = alasql('select * from interview where jobid = ?',q1);
	for (var i = 0; i < req.length; i++) {
		var single = req[i];
		var interviews = alasql('select * from scheduleInterview where appid = ?', single.appid);
		if (interviews.length > 0) {
			continue;
		}
		
	}
} 
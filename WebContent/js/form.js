var jobid = parseInt($.url().param('jobid'));
if(!jobid || alasql('select * from job where id = ?',[jobid]) .length == 0)  window.location.href = "page404-candidate.html"
var job = alasql('select * from job where id = ?',[jobid])[0];

$('#jobid').html('Job ID: ' + job.id);
$('#about-company').text(job.company);
$('#resp').text(job.description);
$('#req').text(job.requirement);
$('pref_req').text(job.preferred_req);
$('#job-dept').text(alasql('select * from department where id= ?', [job.dept])[0].dept);
$('#job-employ').text(job.employment);
$('#job-deadline').text(job.closedate);

function showform()
{
    console.log(10);
    $('#panel-form').show();
}
function addNewEducation(e)
{
    var select = 
        '<select class = "form-control"> \
            <option value="1"> Bachelors </option> \
            <option value="2"> Masters </option> \
            <option value="3"> Phd </option> \
        </select>';
    var row = 
    '<div class="row"> \
        <div class="col-md-2">' + select + '</div> \
        <div class="col-md-4"> \
            <input type="text" class="form-control" placeholder="University Name"> \
        </div> \
        <div class="col-md-3"> \
            <input type="text" class="form-control" placeholder="Major"> \
        </div> \
        <div class="col-md-2"> \
            <input type="number" class="form-control" placeholder="CGPA"> \
        </div> \
        <div class="col-md-1"> \
            <button class="btn btn-warning btn-sm" onclick="deleteEducation(this)"><i class="fa fa-remove"></i></button> \
        </div> \
    <hr></div>';
    var id = e.closest('.panel').id;
    $('#'+id + ' .panel-body').append(row);

}

function deleteEducation(e) {
    e.closest('.row').remove();
}
function addwork(e) 
{
    var work = '\
    <form class="form-horizontal">\
        <div class="form-group"> \
            <label for="inputEmail3" class="col-sm-2 control-label">Position</label> \
            <div class="col-sm-10">\
                <input type="text" class="form-control" id="inputEmail3" placeholder="Position in your past company">\
            </div>\
        </div>\
        <div class="form-group">\
            <label for="inputEmail3" class="col-sm-2 control-label">Company Name</label> \
            <div class="col-sm-10">\
                <input type="email" class="form-control" id="inputEmail3" placeholder="Company Name">\
            </div>\
        </div> \
        <div class="form-group">\
            <label for="inputEmail3" class="col-sm-2 control-label">Duration</label>\
            <div class="col-sm-10">\
                <input type="number" class="form-control" id="inputEmail3" placeholder="Duration in months">\
            </div>\
        </div>\
        <div class="form-group">\
            <label for="inputEmail3" class="col-sm-2 control-label">Description</label>\
            <div class="col-sm-10">\
                <textarea class="form-control" rows="3"  placeholder="Description of your work"></textarea> \
            </div>\
        </div> \
        <button class="btn btn-warning btn-sm pull-right" onclick="deleteWork(this)"><i class="fa fa-remove"></i></button><br><hr>\
    </form>';
    $('#' +e.closest('.panel').id + ' .panel-body').append(work);
}

function deleteWork(e)
{
    e.closest('.form-horizontal').remove();
}
function addproject(e)
{
    var work = '\
    <form class="form-horizontal">\
        <div class="form-group"> \
            <label for="inputEmail3" class="col-sm-2 control-label">Project Name</label> \
            <div class="col-sm-10">\
                <input type="text" class="form-control" id="inputEmail3" placeholder="Name of your Project">\
            </div>\
        </div>\
        <div class="form-group">\
            <label for="inputEmail3" class="col-sm-2 control-label">Description</label>\
            <div class="col-sm-10">\
                <textarea class="form-control" rows="3"  placeholder="Description of your work"></textarea> \
            </div>\
        </div> \
        <button class="btn btn-warning btn-sm pull-right" onclick="deleteProject(this)"><i class="fa fa-remove"></i></button><br><hr>\
    </form>';
    $('#' +e.closest('.panel').id + ' .panel-body').append(work);
}
function deleteProject(e)
{
    e.closest('.form-horizontal').remove();
}

function addlanguage(e)
{
    var select = '<select class="form-control">';
    var languages = alasql('select * from language');
    for (var i = 0; i < languages.length; i ++) {
        select += '<option value="' + languages[i].id + '">' + languages[i].name + '</option>';
    }
    select += '</select>';
    console.log(select);
    var row = 
    '<div class="row"> \
        <div class="col-md-3">' + select+ '</div> \
        <div class="col-md-4"> \
            <input type="number" class="form-control" placeholder="Experience in months"> \
        </div> \
        <div class="col-md-offset-4 col-md-1"> \
            <button class="btn btn-warning btn-sm" onclick="deleteEducation(this)"><i class="fa fa-remove"></i></button> \
        </div> \
    <hr></div>';
    var id = e.closest('.panel').id;
    console.log(id);
    $('#'+id + ' .panel-body').append(row);
}

function addachievement(e)
{
    var work = '\
    <form class="form-horizontal">\
        <div class="form-group"> \
            <label for="inputEmail3" class="col-sm-2 control-label">Name</label> \
            <div class="col-sm-10">\
                <input type="text" class="form-control" id="inputEmail3" placeholder="Name">\
            </div>\
        </div>\
        <div class="form-group">\
            <label for="inputEmail3" class="col-sm-2 control-label">Description</label>\
            <div class="col-sm-10">\
                <textarea class="form-control" rows="2"  placeholder="Description of your achievement"></textarea> \
            </div>\
        </div> \
        <button class="btn btn-warning btn-sm pull-right" onclick="deleteProject(this)"><i class="fa fa-remove"></i></button><br><hr>\
    </form>';
    $('#' +e.closest('.panel').id + ' .panel-body').append(work);
} 


function applicationSubmit()
{

    var appid = alasql('SELECT MAX(id) + 1 as id FROM application')[0].id;



    var person = $('#personal');
    var today = new Date();
    var date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);  
    var newApplication = []
    newApplication.push(appid);
    newApplication.push(jobid);
    newApplication.push(person.find('#cname').val());
    newApplication.push(person.find('#cphone').val());
    newApplication.push(person.find('#cemail').val());
    newApplication.push(date);
    newApplication.push(person.find('#caddress').val());
    newApplication.push(person.find('#ccountry').val());
    newApplication.push(1);

    alasql('insert into application values(?,?,?,?,?,?,?,?,?)', newApplication);



    var education = $('#education');
    var rows = education.find('.row');
    for(var i = 0; i < rows.length; i ++) {
        var e = $(rows[i]);
        var allinputs = (e.find(':input'));
        
        var newedu = []
        newedu.push(alasql('SELECT MAX(id) + 1 as id FROM educan')[0].id);
        newedu.push(appid);
        newedu.push($(allinputs[0]).val());
        newedu.push($(allinputs[1]).val());
        newedu.push($(allinputs[2]).val());
        newedu.push($(allinputs[3]).val());
        console.log(newedu);
        alasql('insert into educan values(?,?,?,?,?,?)', newedu);
        
    }

    var work = $('#workexp');
    var rows = work.find('.form-horizontal');
    for(var i = 0; i < rows.length; i ++) {
        var e = $(rows[i]);
        var allinputs = (e.find(':input'));
        console.log(allinputs);

        var newWork = []
        newWork.push(alasql('SELECT MAX(id) + 1 as id FROM workexp')[0].id);
        newWork.push(appid);
        newWork.push($(allinputs[0]).val());
        newWork.push($(allinputs[1]).val());
        newWork.push(parseInt($(allinputs[2]).val()));
        newWork.push($(allinputs[3]).val());
        console.log(newWork);
        alasql('insert into workexp values(?,?,?,?,?,?)', newWork);

    }


    console.log("HI");
    var project = $('#projects');
    rows = project.find('.form-horizontal');

    for(var i = 0; i < rows.length; i ++) {
        var e = $(rows[i]);
        var allinputs = (e.find(':input'));
        console.log(allinputs);

        var newWork = []
        newWork.push(alasql('SELECT MAX(id) + 1 as id FROM project')[0].id);
        newWork.push(appid);
        newWork.push($(allinputs[0]).val());
        newWork.push($(allinputs[1]).val());
        
        console.log(newWork);
        alasql('insert into project values(?,?,?,?)', newWork);

    }

    var lang = $('#ProgrammingLanguages');
    rows = lang.find('.row');
    for(var i = 0; i < rows.length; i ++) {
        var e = $(rows[i]);
        var allinputs = (e.find(':input'));
        console.log(allinputs);

        var newWork = []
        newWork.push(alasql('SELECT MAX(id) + 1 as id FROM langexp')[0].id);
        newWork.push(appid);
        newWork.push(parseInt($(allinputs[0]).val()));
        newWork.push(parseInt($(allinputs[1]).val()));
        
        console.log(newWork);
        alasql('insert into langexp values(?,?,?,?)', newWork);

    }

    project = $('#achievement');
    rows = project.find('.form-horizontal');

    for(var i = 0; i < rows.length; i ++) {
        var e = $(rows[i]);
        var allinputs = (e.find(':input'));
        console.log(allinputs);

        var newWork = []
        newWork.push(alasql('SELECT MAX(id) + 1 as id FROM acheivement')[0].id);
        newWork.push(appid);
        newWork.push($(allinputs[0]).val());
        newWork.push($(allinputs[1]).val());
        
        console.log(newWork);
        alasql('insert into acheivement values(?,?,?,?)', newWork);
    }


    window.location.href = "thank.html";

}
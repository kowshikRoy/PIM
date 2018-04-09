

var positions = alasql('select * from position');
console.log(positions);
var position_select = $('<select class="form-control"> </select> ');
for(var i = 0; i < positions.length; i ++) {
    var option = '<option value = ' + positions[i].id+ ' > ' + positions[i].position + '</option>';
    position_select.append(option);
}
$('#position').html(position_select);


var departments = alasql('select * from department');
console.log(departments);
var dept_select = $('<select class="form-control"> </select>');
for(var i = 0; i < departments.length ; i ++) {
    var option = '<option value = ' + departments[i].id + '> ' + departments[i].dept + '</option>';
    dept_select.append(option);
}

$('#department').html(dept_select);

function insertDepartment(e){
    var out = e.closest('.modal').id;
    var selector = '#' +  out + ' input'; 
    console.log(selector); 
    var value = $(selector).val();
    var id = alasql('SELECT MAX(id) + 1 as id FROM department')[0].id;
    alasql('INSERT INTO department VALUES(?,?);', [id, value] );
    dept_select.append('<option value=' + id + '>' + value+ '</option>');
    $('#' + out).modal('toggle');
}  

function insertPosition(e) {
    var out = e.closest('.modal').id;
    var selector = '#' +  out + ' input'; 
    console.log(selector); 
    var value = $(selector).val();
    var id = alasql('SELECT MAX(id) + 1 as id FROM position')[0].id;
    alasql('INSERT INTO position VALUES(?,?);', [id, value] );
    position_select.append('<option value=' + id + '>' + value+ '</option>');
    $('#' + out).modal('toggle');
    
}

function insertJob() {
    var id = alasql('SELECT MAX(id) + 1 as id FROM job')[0].id;
    var texts = $('textarea');
    var newjob = []
    
    
    var description = "Job Description <br>";
    for(var i = 0; i < texts.length; i++){
        var e = texts[i];
        description = description + '<br>' + texts[i].value;
    }
    
    var today = new Date();
    var date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
    var position = parseInt($('#position select').val());
    var active = 1;
    today =  new Date($('#application-close').val());
    var closedate = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
    
    newjob.push(id);
    newjob.push(position);
    newjob.push(date);
    newjob.push(description);
    newjob.push(active);
    newjob.push(closedate);
    newjob.push(parseInt($('#department select').val()));
    newjob.push($('#employment').val());
    console.log(newjob);

    alasql('INSERT INTO job VALUES(?,?,?,?,?,?,?,?);', newjob);


}
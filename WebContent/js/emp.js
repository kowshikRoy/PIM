// read personal info
var id = parseInt($.url().param('id'));
var emp = alasql('SELECT * FROM emp WHERE id=?', [ id ])[0];
$('#number').text(emp.number);
$('#name').text(emp.name);
$('#sex').text(DB.choice(emp.sex));
$('#birthday').text(emp.birthday);
$('#tel').text(emp.tel);
$('#ctct_name').text(emp.ctct_name);
$('#ctct_addr').text(emp.ctct_addr);
$('#ctct_tel').text(emp.ctct_tel);
$('#pspt_no').text(emp.pspt_no);
$('#pspt_date').text(emp.pspt_date);
$('#pspt_name').text(emp.pspt_name);
$('#rental').text(DB.choice(emp.rental));


// set image and name
$('#img-emp').attr('src', 'img/' + emp.id + '.jpg');
$('#div-name_kanji').text(emp.name);
$('#div-number').text(emp.number);
$('#nav-emp').text(emp.name);
$('#form-emp').attr('href', 'emp-form.html?id=' + id);
$('#position').text(alasql('select * from position where id=?', [emp.position])[0].position);
// read address info
var addrs = alasql('SELECT * FROM addr WHERE emp=?', [ id ]);
for (var i = 0; i < addrs.length; i++) {
	var addr = addrs[i];
	var tr = $('<tr>').appendTo('#tbody-addr');
	tr.append('<td>' + addr.zip + '</td>');
	tr.append('<td>' + addr.state + '</td>');
	tr.append('<td>' + addr.city + '</td>');
	tr.append('<td>' + addr.street + '</td>');
	tr.append('<td>' + addr.bldg + '</td>');
	tr.append('<td>' + DB.choice(addr.house) + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="addr-form.html?id=' + addr.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-addr').attr('href', 'addr-form.html?emp=' + id);

// read family info
var families = alasql('SELECT * FROM family WHERE emp=?', [ id ]);
for (var i = 0; i < families.length; i++) {
	var family = families[i];
	var tr = $('<tr>').appendTo('#tbody-family');
	tr.append('<td>' + family.name + '</td>');
	tr.append('<td>' + DB.choice(family.sex) + '</td>');
	tr.append('<td>' + family.birthday + '</td>');
	tr.append('<td>' + family.relation + '</td>');
	tr.append('<td>' + DB.choice(family.cohabit) + '</td>');
	tr.append('<td>' + DB.choice(family.care) + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="family-form.html?id=' + family.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-family').attr('href', 'family-form.html?emp=' + id);

// read academic history
var edus = alasql('SELECT * FROM edu WHERE emp=?', [ id ]);
for (var i = 0; i < edus.length; i++) {
	var edu = edus[i];
	var tr = $('<tr>').appendTo('#tbody-edu');
	tr.append('<td>' + edu.school + '</td>');
	tr.append('<td>' + edu.major + '</td>');
	tr.append('<td>' + edu.grad + '</td>');
	var td = $('<td class="text-right">').appendTo(tr);
	$('<a href="edu-form.html?id=' + edu.id + '" class="btn btn-xs btn-primary">').html(
			'<span class="glyphicon glyphicon-pencil"></span> Edit').appendTo(td);
	$('<span> </span>').appendTo(td);
	$('<a class="btn btn-xs btn-danger">').html('<span class="glyphicon glyphicon-remove"></span> Delete').appendTo(td);
}
$('#ins-edu').attr('href', 'edu-form.html?emp=' + id);

// delete employee
function destroy() {
	if (window.confirm('are you sure to delete employee?')) {
		alasql('DELETE FROM emp WHERE id=?', [ id ]);
		window.location.assign('index.html');
	}
}

var today = new Date();
var date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
    
$('#calendar').fullCalendar({
	header: {
	  left: 'prev,next today',
	  center: 'title',
	  right: 'listDay,listWeek,month'
	},

	// customize the button names,
	// otherwise they'd all just say "list"
	views: {
	  listDay: { buttonText: 'list day' },
	  listWeek: { buttonText: 'list week' }
	},
	selectable: true,
	selectHelper: true,
	select: function(start, end) {
	  var title = prompt('Event Title:');
	  var eventData;
	  if (title) {
		eventData = {
		  title: title,
		  start: start,
		  end: end
		};
		$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
	  }
	  $('#calendar').fullCalendar('unselect');
	},
	defaultView: 'listWeek',
	defaultDate: date,
	navLinks: true, // can click day/week names to navigate views
	editable: true,
	eventLimit: true, // allow "more" link when too many events
	events: []
  });

  $('#calendar-choose').fullCalendar({
	header: {
	  left: 'prev,next today',
	  center: 'title',
	  right: 'agendaDay,agendaWeek,listWeek'
	},

	// customize the button names,
	// otherwise they'd all just say "list"
	views: {
		agendaDay: { buttonText: 'Today' },
		agendaWeek: {buttonText: 'This Week'},
		listWeek : { buttonText: 'List Week'}
	},
	
	selectable: true,
	selectHelper: true,
	select: function(start, end) {
	  var title = ' ';
	  var eventData;
	  if (title) {
		eventData = {
		  title: title,
		  start: start,
		  end: end
		};
		$('#calendar-choose').fullCalendar('renderEvent', eventData, true); // stick? = true
	  }
	  $('#calendar-choose').fullCalendar('unselect');
	},
	defaultView: 'listWeek',
	defaultDate: date,
	navLinks: true, // can click day/week names to navigate views
	editable: true,
	eventLimit: true, // allow "more" link when too many events
	events: []
  });

  function testFunction()
  {
	  var e = $('#calendar-choose').fullCalendar('clientEvents');
	  console.log(e);
	 
	var planid =  alasql('SELECT MAX(id) + 1 as id FROM empplan')[0].id;
	 for(var i = 0; i < e.length ; i ++) {
        var title = e[i].title;
        var start = Date.parse(e[i].start);
        var end = Date.parse(e[i].end);
        console.log(planid, id, title, start, end, $('#empPlan-choose').val());
        
        alasql('insert into empplan values (?,?,?,?,?,?);', [planid, id,$('#empPlan-choose').val(), title, start,  end]);

     }
     $('#calendar-choose').fullCalendar('removeEvents');
	 planList();
  }
  $('#calendar-choose').fullCalendar('option', 'timezone', 'local');
planList();
showCalendar();
function planList() 
{
    var plans = alasql('select * from empplan where empid = ? order by id',[id]);
    console.log(plans);
    var prev = -1;
    var counter = 1;
    
    
    $('#accordion').html('');
    for(var i = 0; i < plans.length ; i ++) {
        console.log(i);
        var plan = '<h3>#' + counter + ' - ' + plans[i].type + ' plan </h3>';
        var div = $('<div id = "plan'+plans[i].id + '"></div>');
        var list = $('<ul class="list-group"> </ul>');
        var j = i;
        while(j < plans.length && plans[j].id == plans[i].id) {
            var start = new Date(plans[j].st);
            var end = new Date(plans[j].ed);
            list.append(
                '<li class="list-group-item"> \
                    <div class="row" > \
                        <div class="col-md-6">\
                            <p> Start \
                            <p>' + start.toString() + '</p> \
                        </div> \
                        <div class="col-md-6">\
                            <p> End \
                            <p>' + end.toString() + '</p> \
                    </div> \
                </li>'
            );
            j ++;
        }
        i = j-1;
        div.append(list);
        div.append('<button class="btn btn-danger btn-sm pull-right" onclick="deleteplan(this)"><i class="fa fa-remove"> </i></button>');
        $('#accordion').append(plan);
        $('#accordion').append(div);
        counter ++;
    }
    $( "#accordion" ).accordion({
        heightStyle: "content",
        collapsible: true,
        active:false,

    });
    $('#accordion').accordion('refresh');

    
}


function deleteplan(e) {
    var planid = parseInt(e.closest('div').id.slice(4));
    alasql('delete from empplan where id = ?', [planid]);
    planList();
}

function showCalendar() 
{
	console.log(100);
	$('#calendar').fullCalendar('option', 'timezone', 'local');
    var plans = alasql('select * from empplan where empid = ? order by id',[id]);
    for(var i = 0; i < plans.length ; i ++) {
        var newEvent = {
            title : plans[i].title,
            start : new Date(plans[i].st),
            end   : new Date(plans[i].ed)
        }
        $('#calendar').fullCalendar('renderEvent',newEvent, true);
    }
    
}


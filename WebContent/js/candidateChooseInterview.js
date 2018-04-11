var canid = parseInt($.url().param('id'));
var application = alasql('select * from application where id = ?',[canid])[0];

showInCalendarPlan();
$('#welcome').text('Welcome ' + application.name);



var today = new Date();
var date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
    
// $('#calendar').fullCalendar({
// 	header: {
// 	  left: 'prev,next today',
// 	  center: 'title',
// 	  right: 'listDay,agendaWeek,month'
// 	},

// 	// customize the button names,
// 	// otherwise they'd all just say "list"
// 	views: {
// 	  listDay: { buttonText: 'list day' },
// 	  listWeek: { buttonText: 'list week' }
// 	},
// 	selectable: true,
// 	selectHelper: true,
// 	select: function(start, end) {
// 	  var title = prompt('Event Title:');
// 	  var eventData;
// 	  if (title) {
// 		eventData = {
// 		  title: title,
// 		  start: start,
// 		  end: end
// 		};
// 		$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
// 	  }
// 	  $('#calendar').fullCalendar('unselect');
// 	},
// 	defaultView: 'listWeek',
// 	defaultDate: date,
// 	navLinks: true, // can click day/week names to navigate views
// 	editable: true,
// 	eventLimit: true, // allow "more" link when too many events
// 	events: []
//   });

function showInCalendarPlan() 
{
    var plans = alasql('select * from empplan');

    startpoints = []
    endpoints = [] 

    for(var i = 0; i < plans.length; i ++) {
        var plan = plans[i];
        if(plan.type == 'once') {
            
        }
        if(plan.type == 'weekly') {
            console.log('weekly');
        }
        if(plan.type == 'daily') {
            console.log('daily');
        }
    }

}
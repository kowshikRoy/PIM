var q1= parseInt($.url().param('id'));
console.log(q1);

if(q1) {
    var job = alasql('select * from job where id=?', [ q1 ])[0];
    console.log(job);
    if(job) {
        $('#page404').hide();
        $('#j-description').text(job.description);

        // interviewer populate
        var $interviewer = $('#j-interviewer');
        var interviewer = alasql('select * from interview where jobid = ?', [q1]);
        var out  = $('<ul class="list-group"> </ul>');
        for(var i = 0; i < interviewer.length ; i ++) {
            var empid = interviewer[i].empid;
            var employee = alasql('select * from emp where id = ?',[empid])[0];
            var indiv = '<li class = "list-group-item"> \
                        <div class="row"> \
                            <div class="col-md-1"><img class="img-rounded" width="40" src="img/' + employee.id + '.jpg" > </div> \
                            <div class="col-md-11"><a href = "emp.html?id='  + employee.id + '">' + employee.name +  '</a><br> Software Engineer </div> \
                        </div> \
                        </li>';
             
            console.log(indiv);
            
            out.append(indiv);
        }
        $interviewer.append(out);



        // candidate populate
        var candidates = alasql('select * from application where jobid = ?', [q1]);
        
        for(var i = 0; i < candidates.length ; i ++) {

        }

    }
    else {
        $('#content').hide();
        $('#page404').html('<h1>404</h1> <h4> Please use valid job id </h4> <a href="dashboard.html" class="btn btn-warning"> Go to Dashboard </a> ');
    }
}
else {
    $('#content').hide();
    $('#page404').html('<h1>404</h1> <h4> Please use valid job id </h4> <a href="dashboard.html" class="btn btn-warning"> Go to Dashboard </a> ');
}
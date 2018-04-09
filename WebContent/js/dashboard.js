var activejobs = $('#active-jobs');
var pastjobs = $('#past-jobs');
var qactive = alasql('select * from job where active = 1 order by date desc')
var qpast = alasql('select * from job where active = 0 order by date desc')
console.log(activejobs);


var today = new Date();
var dateString = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
for(var i = 0; i < qactive.length; i ++) {
    var job = qactive[i];
    if(i) activejobs.append('<hr>');
    var className, str;
    if(dateString.localeCompare(job.closedate) > 0) className = "btn-warning", str ="Application Closed";
    else  className = "btn-success", str ="Application Open";

    var position = alasql('select * from position where id=?', [job.position])[0].position;
    console.log(position);
    var divs = 
    '<div class="panel panel-default"> \
        <div class="panel-heading"> \
            <h3 class="panel-title"> \
                <div class="row"> \
                    <div class="col-md-8">#' + job.id + ': ' + position +    
                    '<p style="font-size:13px">Posting Date: ' + job.date + '<p> \
                    </div> \
                    <div class="col-md-2"> <button class="btn ' + className +  '">'  + str + '</button> </div> \
                    <div class="col-md-2"> <a href="job.html?id=' + job.id + '" class="btn btn-success"> Go to Job </a> </div> \
                </div> \
            </h3> \
        </div> \
        <div class ="panel-body" >' + job.description + ' \
    </div>';


    activejobs.append(divs);
}

for(var i = 0; i < qpast.length; i ++) {
    var job = qpast[i];
    if(i) pastjobs.append('<hr>');
    var className, str;
    if(dateString.localeCompare(job.closedate) > 0) className = "btn-warning", str ="Application Closed";
    else  className = "btn-success", str ="Application Open";
    var position = alasql('select * from position where id=?', [job.position])[0].position;
    var divs = 
    '<div class="panel panel-default"> \
        <div class="panel-heading"> \
            <h3 class="panel-title"> \
                <div class="row"> \
                    <div class="col-md-8">#' + job.id + ': ' + position +    
                    '<p style="font-size:13px">Posting Date: ' + job.date + '<p> \
                    </div> \
                    <div class="col-md-2"> <button class="btn ' + className +  '">'  + str + '</button> </div> \
                    <div class="col-md-2"> <a href="job.html?id=' + job.id + '" class="btn btn-success"> Go to Job </a> </div> \
                </div> \
            </h3> \
        </div> \
        <div class ="panel-body" >' + job.description + ' \
    </div>';


    pastjobs.append(divs);
}
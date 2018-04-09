var applicationId = parseInt($.url().param('appId'));
if (applicationId) {
    console.log(applicationId);
    var appId = alasql('SELECT * FROM application WHERE id=?', [ applicationId ])[0];
    console.log(appId);
    if (appId) {
        $('#page404').hide();

        $('#pic').attr('src','img/'+appId.id+'.jpg');
        $('#name1').text(appId.name);
       
        if(appId.isactive == 1) $('#status').css('color', '#00c851');
        else $('#status').css('color', '#ff4444');
        var social = $('#social');
        if(appId.linkedin) social.append('<a href="http://'+ appId.linkedin + '" class="btn"><i  class="fa fa-2x fa-linkedin-square"></i></a>');
        if(appId.github) social.append('<a href="http://'+ appId.github + '" class="btn"><i " class="fa fa-2x fa-github"></i></a>');
        if(appId.stackoverflow) social.append('<a href="http://'+ appId.stackoverflow + '" class="btn"><i " class="fa fa-2x fa-stack-overflow"></i></a>');

        var profile = $('#profile');
        console.log(profile);
        $('#application-number').text(appId.id);
        $('#name').text(appId.name);
        $('#phone').text(appId.phone);
        $('#email').text(appId.email);
        $('#application-date').text(appId.date);
        $('#address').text(appId.address);
        $('#country').text(appId.country);
    }
    else {
        $('#content').hide();
        $('#page404').html('<h1>404</h1> <h4> Please use valid application id </h4> <a href="index.html" class="btn btn-warning">Back</a> ')
    }
}
else {
    $('#content').hide();
    $('#page404').html('<h2>404</h2> <p> Please use valid application id </p> <a href="index.html" class="btn btn-default">Back</a> ')
}
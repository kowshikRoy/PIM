var positions = alasql('select position from position');
console.log(positions);
var position_select = $('<select class="form-control"> </select> ');
for(var i = 0; i < positions.length; i ++) {
    var option = '<option value = "' + positions[i].position+ '" > ' + positions[i].position + '</option>';
    position_select.append(option);
}
$('#position').html(position_select);
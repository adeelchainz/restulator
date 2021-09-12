$(document).ready(function(){

    getEmployee();

    $("#form-submit").submit(function(e) {
        var emp_id = $("#employee").val();
        var formData = {
            'email' : $("#email").val(),
            'password': $("#password").val(),
            'emp_id': $("#employee").val()
        }
        if($('#password').val() ==  $('#confirm_password').val()) {

        $.ajax({
            url: '/api/user/signup',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: (json) => {
                if(json.status) {
                    $("#modal-title").html(`
                        Sign Up!!
                    `);

                    $('#modal-body').html(`
                        Sign Up successfull!
                    `);

                    $("#modal").modal('show');

                    $("#modal").on('hidden.bs.modal', function () {
                        location.href = "/login";
                    });
                }

                else {
                    $("#modal-title").html(`
                        Sign Up!!
                    `);

                    $('#modal-body').html(`
                    Error while registering for this user. Please Try Again!
                    `);

                    $("#modal").modal('show');

                    $("#modal").on('hidden.bs.modal', function () {
                        window.location.reload();
                    });
                    
                }
            }				
        });
        }
        else {
            $("#checkpass").html("Password does not match");
        }
        e.preventDefault();
    });  

});
function getEmployee(e) {
    $.ajax({
                    type :'GET',
                    url : '/api/user/employee/',
                    success:(json) =>{
                            jsonData = json.data;
                            var x ="", i;

                            for (i=0; i<jsonData.length; i++) {
                                    x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";            
                            }
                            elem = document.getElementById("employee")

                            df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                            for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                    var option = document.createElement('option'); // create the option element
                                    option.value = jsonData[i].id; // set the value property
                                    option.appendChild(document.createTextNode(jsonData[i].name)); // set the textContent in a safe way.
                                    df.appendChild(option); // append the option to the document fragment
                            }
                            elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
                    }
            });
}
	
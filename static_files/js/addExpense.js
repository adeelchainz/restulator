$(document).ready(()=>{

    $("#alert-success").hide();
    $("#alert-danger").hide();

    $.ajax({
        type :'GET',
        url : '/api/employee/getAllEmployee',
        }).done(function(result){
            if (result.data) {
                elem = document.getElementById("employee_selectlist")
                // console.log(data.data);
                // console.log(data.data[0].id + " " + data.data[0].name);

                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                for (var i = 0; i < result.data.length; i++) { 
                        var option = document.createElement('option'); // create the option element
                        option.value = result.data[i].id; 
                        option.appendChild(document.createTextNode(result.data[i].name)); 
                        df.appendChild(option); 
                }
                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

            }
            
        }).fail(function() {
            window.alert('Network Error!');
            
        });





    





    $("#salaryAddForm").submit(function(e){
        var date = new Date($("#datetimeSalary").val()); 
    
        var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];                      
        console.log("converted date: " + conv_date );        
        $.ajax({    
            url: '/api/salary/',
            type: 'POST',
            data: {
                id : '',
                emp_id : $('#employee_selectlist').val(),
                amount: $('#salary_amount').val(),
                salary_for: conv_date,
                status: $('#salary_status_selectlist').val()

            }
        }).done(function(result){
            console.log(result);
            if (result.data) {
                window.location.reload();
                $("#alert-success").show();
            }
            else $("#alert-danger").show();
        }).fail(function() {
            window.alert('Network Error!');
            
        });
        e.preventDefault();

    });



});
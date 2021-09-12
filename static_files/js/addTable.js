$(document).ready(()=>{
    $("#alert-success").hide();
    $("#alert-danger").hide();


    $("#tableAddForm").submit(function(e){
        $.ajax({
            type :'POST',
            url : '/api/tables',
            data : {
                capacity:$('#table_quantity').val(),
                status: $('#table_status_selectlist').val()

            }                       
            
        }).done(function(result){
                if(result.data){
                        
                        console.log("Table Added Successfully");
                        window.location.reload();
                        $("#alert-success").show();                                        
                        
                }
                else{
                        $("#alert-danger").show();
                }
        }).fail(function() {
                window.alert('Network Error! Try Again!');
        });

    e.preventDefault();          
        
    });


});
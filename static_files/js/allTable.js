$(document).ready(function(){

    var s = $("#tables_details").DataTable({
        ajax: {
            url: `/api/tables/`,
            type: "GET",

        },
        dataSrc: 'data',
        columns: [
            {data: 'id'},
            {data: 'capacity'},
            {data: 'status'},
            { 
                "render": function (data, type, row, meta ) {
                return '<button  data-id= \"' + row.id + '\"  data-capacity="'+row.capacity+'"  data-status="'+row.status+'"  class="btn btn-success btn-sm" data-toggle="modal" data-target="#tableEditModal"><i class="fas fa-edit"></i></button>  <button  data-id= \"' + 
                row.id + 
                '\" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#tableDeleteModal"><i class="far fa-trash-alt"></i></button>'


                }
            }
            
        ]
    });    
    $("#tableDeleteModal").on('show.bs.modal', function (e) {
        var triggerLink = $(e.relatedTarget);
        var buttonID = triggerLink.data("id");
        // console.log(buttonID);
        $(this).find(".modal-body").html('<div class"row"><div class="col-sm-12">Are you sure you want to delete this?</div><div class="col-sm-12"> <button class="btn btn-success" type="button" data-dismiss="modal" onclick="Delete_table('+buttonID+')">Delete</button></div></div>');
        




    });
    $("#tableEditModal").on('show.bs.modal', function (e) {
        var triggerLink = $(e.relatedTarget);
        var tableId = triggerLink.data("id");
        // console.log("Table id: " + tableId);
        $('#table_capacity').val(triggerLink.data("capacity"));
        $('#table_status_selectlist').val(triggerLink.data("status")).prop('selected',true);

        $(function(){
            $('#tableEditForm').validate({
                rules:{
                    table_capacity:{
                        required:true,
                        digits:true
                    }

                },
                messages:{
                    table_capacity:{
                        required:"Please Provide capacity!",
                        digits:"Please enter only digits"
                    }
                }

            });

        });

        $("#tableEditButton").click(function(e){   
            console.log($('#table_capacity').val());
            // console.log(isNumeric($('#table_capacity').val()))           
            if($('#tableEditForm').valid()){
                $.ajax({
                    type :'PUT',
                    url : '/api/tables/' + tableId,
                    data:{
                        capacity: $('#table_capacity').val(),
                        status: $('#table_status_selectlist').val()
                    }
                    }).done(function(result){
                        if(result.data){
    
                            console.log(result.data);
                            $("#modal-alert-success").show();
                            // window.location.reload();
                                
                        }
                    }).fail(function() {
                        $("#modal-alert-danger").show();                        
                        window.alert('Network Error! Try Again!');
                    });  
                    window.location.reload();              
                    e.preventDefault();
            }


    
        
        }); 
        e.preventDefault();

    });




});

function Delete_table(buttonId){
    console.log("Table-info ID:" + buttonId);

            $.ajax({
                    url:"/api/tables/" + buttonId,
                    method: "DELETE",
                }).done(function(result){
                    if(result.data){

                        // console.log(result.data);

                        window.location.reload();
                            
                    }
                }).fail(function() {
                        window.alert('Network Error! Try Again!');
                });                    


                    
            
            window.location.reload();                

};

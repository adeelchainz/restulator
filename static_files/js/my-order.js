
$(document).ready(()=>{
    $("#alert-success").hide();
    $("#alert-danger").hide();

    var current_waiter_id = $('#test_div').data("id");

    $('#dataTable').DataTable({
        ajax: {
            url: `/api/waiter-report/${current_waiter_id}`,
            type: "GET"
        },
        dataSrc: 'data',
        columns: [
            {data: 'order_id'},
            {data: 'Customer'},
            {data: 'Cook'},
            {data: 'Total Amount'},
            {
                render: function (data, type, row) {
                    return new Date(row['Order Time']);
                }
            },
            {data: 'Order Status'},
            {data: 'Payment Status'},
            {data:"order_id","render": function (data, type, row, meta ) {
                return '<button type="button" id="'+ data +' "class="btn btn-primary badge-pill edit" data-toggle="modal"  data-order_id="'+data+'" data-cook="'+row.Cook+'" data-order_status="'+row['Order Status'] +'" data-order_time="'+row['Order Time'] +'"  data-target="#editModal">Edit&nbsp<i class="fas fa-edit"></i></button>' +
                '<button id="' + row.id + ' "class="btn btn-danger badge-pill delete" data-toggle="modal" data-order_id="'+data+'"  data-target="#deleteModal" style="margin-top:3px";>Delete&nbsp<i class="far fa-trash-alt"></i></button>';
          }
        }
        ],
        "columnDefs": [
            { "width": "18%", "targets": 4 }
          ]
    });

    $("#deleteModal").on('show.bs.modal', function (e) {
        var triggerLink = $(e.relatedTarget);
        var order_id = triggerLink.data("order_id");

        $("#del-order").click(function(e){
  
        $.ajax({
                url:"/api/allOrders/" + order_id,
                method: "DELETE",
                success: function(data) {         
                if(data.status) {
                        $("#modal-title").html(`
                        Delete Order!!
                        `);
                        $('#modal-body').html(`
                       Successfully Deleted Order!
                        `);
                        $("#modal").modal('show');        
                }
                else {
                        $("#modal-title").html(`
                                Delete Order!!
                                `);
                                $('#modal-body').html(`
                                Error while deleting the Order. Please Try Again!
                                `);
                                $("#modal").modal('show');
                }
        }
          
        });
        e.preventDefault();
    } );
});

        $("#close-delete").click(function(e){
                window.location.reload();
        });

        $('#edit-OrderForm').validate({
            rules: {
                    kitchen: "required",
                    time: "required",
                    status: "required"
                }
                
    });


        $("#editModal").on('show.bs.modal', function (e) {
            var triggerLink = $(e.relatedTarget);
            var order_id = triggerLink.data("order_id");
            var order_status = triggerLink.data("order_status");
            var cook_name = triggerLink.data("cook");  
            var order_time = triggerLink.data("order_time");

            getCook();

            $("#status").val(order_status); 
            $("#kitchen").val(cook_name);
            $("#order_time").val(order_time);


            $("#edit-order").click(function(e){
                    if($("#edit-OrderForm").valid()) {
                        var date = new Date($("#order_time").val());                
                        var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];                      
                        console.log(conv_date);
                            
               var formData = {
                           'order_id' : order_id,
                           'order_status': $("#status").val(),
                           'cook_id': $("#kitchen").val(),
                           'order_time': conv_date
                           
                   }

                    $.ajax({
                            type: "PUT",
                            url: '/api/nonPaid/my-order/' + order_id,
                            data: formData,
                            dataType: 'json',
                            success: (json) => {
                                    if(json.status){
                                            var divData=document.getElementById("alert-success");
                                            divData.innerHTML="Order is Successfully Updated!";
                                            window.location.reload();
                                    }
                                    else {
                                            var divData=document.getElementById("alert-danger");
                                            divData.innerHTML="Error! Please Check your connection and try again";
                                            window.location.reload();
                                    }

                            }
                           });

            }
            e.preventDefault();
            });

    });




});

function getCook(e) {
    $.ajax({
                    type :'GET',
                    url : '/api/employeeCategory/getCook/name',
                    success:(json) =>{
                            if(json.status) {
                                jsonData = json.data;
                                var x ="", i;
     
                                 for (i=0; i<jsonData.length; i++) {
                                         x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";                                                 
                                 }
                                 elem = document.getElementById("kitchen");
                                 df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                 for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                         var option = document.createElement('option'); // create the option element
                                         option.value = jsonData[i].id; // set the value property
                                         option.appendChild(document.createTextNode(jsonData[i].name)); // set the textContent in a safe way.
                                         df.appendChild(option); // append the option to the document fragment
                                 }
                                 elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
                                
                            }

                            else {
                                $("#modal-title").html(`
                                Retrieve Cook!!
                                `);
                                $('#modal-body').html(`
                                Error while retrieving the Cook. Please Try Again!
                                `);
                                $("#modal").modal('show');
                            }
                           
                    }
            });
}
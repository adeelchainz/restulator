      
      
      
      $(document).ready(function() {
               
        $("#modal").on('hidden.bs.modal', function () {
                window.location.reload();
        });
           
        var t =  $('#dataTable').DataTable( { 
                dom: 'Bfrtip',
                buttons: [
                'copy', 'csv', 'excel', 'pdf','print'
                ],
             "columnDefs": [ {
                    "searchable": true,
                    "orderable": true,
                    "targets": 0
                    } ],
            "order": [],  
            "ajax": {         
                    type :'GET',
                    url : '/api/allOrders/',
                    dataType: 'json',
                                 
            }, 
            "columns": [
            {"data": "bill"},
            { "data":"customer_name"},
            {
                render: function (data, type, row) {
                    return convertDate(row['order_time']).substring(0,convertDate(row['order_time']).lastIndexOf('G'));
                }
            },
            {
                render: function (data, type, row) {
                    return convertDate(row['complete_time']).substring(0,convertDate(row['complete_time']).lastIndexOf('G'));
                }
            },
            { "data": "cook_name"},
            { "data": "waiter_name"},
            {"data": "bill"},
            {"data": "payment_status"},
            {"data":"id","render": function (data, type, row, meta ) {
                    return '<button type="button" id="'+ data +' "class="btn btn-danger badge-pill delete" data-toggle="modal"  data-order_id="'+data+'"  data-target="#deleteModal"><i class="fa fa-trash-alt"></i></button>';
               }
                 }
             ]         
            });

            t.on( 'order.dt search.dt', function () {
                    t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                    cell.innerHTML = i+1;
                    } );
            } ).draw();

             $("#deleteModal").on('show.bs.modal', function (e) {
                var triggerLink = $(e.relatedTarget);
                $("#del-dish").data('order_id', triggerLink.data("order_id")); 
                
             });
                
                $("#del-dish").click(function(e){
                var order_id = $(this).data('order_id');
                $.ajax({
                        url:"/api/allOrders/" + order_id,
                        method: "DELETE",
                        success:(json) =>{
                                jsonData = json.data;
                                if(json.status) {
                                        $("#deleteModal").modal('hide');
                                        $("#modal-title").html(`
                                            Delete Order!!
                                        `);
                                        $('#modal-body').html(`
                                        Order successfully Deleted!
                                    `);
                                    $("#modal").modal('show');
                                }
                                else {
                                        $("#deleteModal").modal('hide');
                                        $("#modal-title").html(`
                                            Delete Order!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while Deleting the Order. Please Try Again!
                                    `);
                                    $("#modal").modal('show');
                                }

                        }
                  
                });
                e.preventDefault();
        });
               
            $("#myModal").on('show.bs.modal', function (e) {

            var triggerLink = $(e.relatedTarget);
            var id = triggerLink.data("id");
            var name  = triggerLink.data("name");
            var price = triggerLink.data("price");
            var type = triggerLink.data("type");
            var description = triggerLink.data("description");
            var type_id = triggerLink.data("type_id");

            $("#name").val(name); 
            $("#price").val(price);
            $("#description").val(description);
            $("#selectlist").val(type_id);

            // $(this).find(".modal-body").html("<h5>id: "+id+"</h5><h5>name: "+ name + "</h5>");

            $("#editEmp").click(function(e){
            
                    var formData= {
                            'id' : id,
                            'name' : $("#name").val(),                                
                            'description': $('#description').val(),
                            'price': $('#price').val(),
                            'dishType_id': $('#selectlist').val()
                    }
                
                            $.ajax({
                                    type :'PUT',
                                    url : '/api/allOrders/',
                                    data : formData,
                                    dataType: 'json',
                                    success:(json) =>{
                                        if(json.status) {
                                                $("#myModal").modal('hide');
                                                $("#modal-title").html(`
                                                        Update Dish!!
                                                `);
                                                $('#modal-body').html(`
                                                Dish Successfully Updated!
                                                `);
                                                $("#modal").modal('show');

                                        }
                                        else {
                                                $("#myModal").modal('hide');
                                                $("#modal-title").html(`
                                                        Update Dish!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while updating the Dish. Please Try Again!
                                                `);
                                                $("#modal").modal('show');
                        
                                        }

                                    }
                            });
                    e.preventDefault();
                    }); 
            });





            function convertDate(date){
                var parseDate;
                var pattern = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\w{1})/;
                if (pattern.test(date)){
              
                  parsedDate = date.replace(pattern, function($0,$1,$2,$3,$4,$5,$6){
                    // Date(year, month, date, hours, minutes, seconds, milliseconds).
                    return new Date($1,$2 - 1,$3,$4,$5,$6,0);
                  });
                  return parsedDate;
                }
                else {
                  return "Invalid Date Time."
                }
              }
});


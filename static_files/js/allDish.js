$(document).ready(function() {

        $("#modal").on('hidden.bs.modal', function () {
                window.location.reload();
        });

            var t =  $('#dataTable').DataTable( { 
                 "columnDefs": [ {
                        "searchable": true,
                        "orderable": true,
                        "targets": 0
                        } ],
                "order": [],  
                "ajax": {         
                        type :'GET',
                        url : '/api/dish/getDishes/allDishes',
                        dataType: 'json'               
                }, 
                                       
                "columns": [
                {"data": "id"},
                { "data":"name"},
                { "data": "description"},
                
                {"data": "type"},
                { "data":'price'},
                {"data":"id","render": function (data, type, row, meta ) {
                        return '<button type="button" id="'+ data +' "class="btn btn-primary badge-pill edit mr-2 mt-2" data-toggle="modal"  data-id="'+row.id+'" data-name="'+row.name+'" data-price="'+row.price+'" data-description="'+row.description+'" data-type="'+row.type+'" data-type_id="'+row.type_id+'"  data-target="#myModal">Edit&nbsp<i class="fas fa-edit"></i></button>' +
                        '<button id="'+ data + '" class="btn btn-info badge-pill info mr-2 mt-2" type="button" data-id="'+data+'" style="margin-left:2px";>View&nbsp<i class="fas fa-info-circle"></i></button>' + 
                        '<button id="' + data + ' "class="btn btn-danger badge-pill delete mt-2" data-toggle="modal" data-dish_id="'+data+'" data-target="#deleteModal">Delete&nbsp<i class="fa fa-trash-alt"></i></button>';
                   }
                     }
                 ],
                 "columnDefs": [
                        { "width": "28%", "targets": 5 }
                      ]           
                });

                t.on( 'order.dt search.dt', function () {
                        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                        cell.innerHTML = i+1;
                        } );
                } ).draw();

                $("#deleteModal").on('show.bs.modal', function (e) {
                        var triggerLink = $(e.relatedTarget);
                        $("#del-dish").data('dish_id', triggerLink.data("dish_id"));  

                });
            
                        $("#del-dish").click(function(e){
                        var dish_id = $(this).data('dish_id');
                        $.ajax({
                                url:"/api/dish/" + dish_id,
                                type: "DELETE",
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#deleteModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Delete Dish!!
                                                `);
                                                $('#modal-body').html(`
                                                Dish successfully Deleted!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                        else {
                                                $("#deleteModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Delete Dish!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Deleting the Dish. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                }
                        
                        });
                        e.preventDefault();
                    });

                $(document).on('click','.info',function(e){

                var dish_id = $(this).attr("id");
                window.localStorage.setItem("dish_id", dish_id);
                location.href = "/dish/view-ingredients";

                });

                $('#editDishForm').validate({
                        rules: {
                                name: "required",
                                description: "required",
                                price:{
                                        required: true,
                                        min:1

                                },
                                selectlist: "required"
 
                            },
                            messages: {
                                name: "Please enter  Dish Name",     
                                description: "Please select any dish",
                                price: {
                                        required: "Please enter price",
                                        min: "Price must be greater than 0"
                                },
                                selectlist: "Please select any category"
                            }
                            
                });
                       
                $("#myModal").on('show.bs.modal', function (e) {

                var triggerLink = $(e.relatedTarget);
                var name  = triggerLink.data("name");
                var price = triggerLink.data("price");
                var type = triggerLink.data("type");
                var description = triggerLink.data("description");
                var type_id = triggerLink.data("type_id");

                
                $("#name").val(name); 
                $("#price").val(price);
                $("#description").val(description);
                $("#selectlist").val(type_id);

                $("#editEmp").data("id", triggerLink.data("id"));

                // $(this).find(".modal-body").html("<h5>id: "+id+"</h5><h5>name: "+ name + "</h5>");
                });

                $("#editEmp").click(function(e){
                    if( $('#editDishForm').valid()) {    
                        var id = $(this).data("id"); 
                        var formData= {
                                'id' : id,
                                'name' : $("#name").val(),                                
                                'description': $('#description').val(),
                                'price': $('#price').val(),
                                'dishType_id': $('#selectlist').val()
                        }
                                $.ajax({
                                        type :'PUT',
                                        url : '/api/dish/',
                                        data : formData,
                                        
                                        dataType: 'json',
                                        success:(json) =>{
                                                jsonData = json.data;
                                                if(json.status) {
                                                        $("#myModal").modal('hide');
                                                        $("#modal-title").html(`
                                                            Edit Dish!!
                                                        `);
                                                        $('#modal-body').html(`
                                                        Dish successfully Edited!
                                                    `);
                                                    $("#modal").modal('show');
                                                }
                                                else {
                                                        $("#myModal").modal('hide');
                                                        $("#modal-title").html(`
                                                            Edit Dish!!
                                                        `);
                                                        $('#modal-body').html(`
                                                        Error while editing the Ingredient. Please Try Again!
                                                    `);
                                                    $("#modal").modal('show');
                                                }

                                        }
                                });
                        e.preventDefault();
                    }
                });
                getDishType();
                
     
});

    function getDishType(e) {
        $.ajax({
                type :'GET',
                url : '/api/dishType/',
                success:(json) =>{

                        if(json.status) {
                                jsonData = json.data;
                                var x ="", i;
                
                                for (i=0; i<jsonData.length; i++) {
                                        x = x + "<option value=" + jsonData[i].type_id + ">" + jsonData[i].type + "</option>";
                        
                                }
                                elem = document.getElementById("selectlist");
                                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                        var option = document.createElement('option'); // create the option element
                                        option.value = jsonData[i].type_id; // set the value property
                                        option.appendChild(document.createTextNode(jsonData[i].type)); // set the textContent in a safe way.
                                        df.appendChild(option); // append the option to the document fragment
                                }
                                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                        }
                        else {
                                $("#myModal").modal('hide');
                                $("#modal-title").html(`
                                        Get Dish Type!!
                                `);
                                $('#modal-body').html(`
                                Error while getting the Dish Types. Please Try Again!
                                `);
                                $("#modal").modal('show');
        
                        }
                }
        });
    }




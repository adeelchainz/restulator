$(document).ready(function() {

    $("#modal").on('hidden.bs.modal', function () {
        window.location.reload();
        });

    var dish_id = localStorage.getItem("dish_id");
    getIngredientType();
    getDishType();
                               
    var t =  $('#dataTable').DataTable( { 
         "columnDefs": [ {
                "searchable": true,
                "orderable": true,
                "targets": 0
                } ],
        "order": [[ 1, 'asc' ]],  
        "ajax": {         
                type :'GET',
                url : '/api/ingredients/getAllIngredients/' + dish_id,
                dataType: 'json',                                              
        }, 
        "columns": [       
            {"data": "id"},
            { "data":"name"},
            { "data": "unit"},
            { "data":'item_quantity'},
            {"data":"dish_id","render": function (data, type, row, meta ) {
            return '<button type="button" id="'+ data +' "class="btn btn-primary badge-pill edit" data-toggle="modal"  data-id="'+data+'" data-name="'+ row.name+'" data-unit="'+row.unit+'" data-quantity="'+row.item_quantity+'" data-item_id="'+row.id+'" data-target="#editModal">Edit&nbsp<i class="fas fa-edit"></i></button>' + 
            '<button id="' + data + ' "class="btn btn-danger badge-pill delete" data-toggle="modal"  data-id="'+data+'" data-item_id="'+row.id+'" data-target="#deleteModal" style="margin-left:3px";>Delete&nbsp<i class="far fa-trash-alt"></i></>';
            }
            }
            ],
            "columnDefs": [
            { "width": "18%", "targets": 4 }
            ]    
            });

            t.on( 'order.dt search.dt', function () {
            t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
            } );
            } ).draw();

            $(".delete").click(function(e) {
                $("#deleteModal").modal('show');
            });

            $("#deleteModal").on('show.bs.modal', function (e) { 
                var triggerLink = $(e.relatedTarget);
                $("#del-ing").data('dish_id', triggerLink.data("id"));
                $("#del-ing").data('item_id', triggerLink.data("item_id"));
            });

            $("#del-ing").click(function(e){
                var dish_id = $(this).data('dish_id');
                var item_id = $(this).data('item_id');

                 formData =  {
                        'item_id': item_id
                }
                $.ajax({
                        type :'DELETE',
                        url : '/api/ingredients/' + dish_id,
                        data : formData,      
                        dataType: 'json',
                        success:(json) =>{
                                jsonData = json.data;
                                if(json.status) {
                                        $("#deleteModal").modal('hide');
                                        $("#modal-title").html(`
                                            Delete Ingredient!!
                                        `);
                                        $('#modal-body').html(`
                                        Ingredient successfully Deleted!
                                    `);
                                    $("#modal").modal('show');
                                }
                                else {
                                        $("#deleteModal").modal('hide');
                                        $("#modal-title").html(`
                                            Delete Ingredient!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while deleting the Ingredient. Please Try Again!
                                    `);
                                    $("#modal").modal('show');
                                }

                        }
                });
            e.preventDefault();
            });

            $("#ingType").change(function ingredient(e){  
                $("#selectIng").children('option:gt(0)').hide();
                $('#selectIng').val("");
                $("#qty").val("");      
                var ingType  = $("#ingType").val();                        
                $.ajax({
                                type :'GET',
                                url : '/api/ingredients/' + ingType,
                                success:(json) =>{
                                        jsonData = json.data;
                                        var x ="", i;
                                        for (i=0; i<jsonData.length; i++) {
                                                x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";
                                        }
                                        elem = document.getElementById("selectIng");
                                        $("#selectIng").children('option:gt(0)').hide();

                                        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                        for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.                                                         
                                                var option = document.createElement('option'); // create the option element
                                                option.value = jsonData[i].id; // set the value property
                                                option.appendChild(document.createTextNode(jsonData[i].name)); // set the textContent in a safe way.
                                                df.appendChild(option); // append the option to the document fragment
                                        }
                                        elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                                        // var selectDishId  = jsonData[0].id;
                                }
                        });
        });

        $('#addIngredientForm').validate({
                rules: {
                        ingType: "required",
                        selectIng: "required",
                        qty: "required",

                    },
                    messages: {
                        ingType: "Please Select  Ingredient Type",     
                        selectIng: "Please select any Ingredient",
                        qty: "Please enter quantity"
                    }
                    
        });
                       $("#addIng2").click(function(e){
                           if($("#addIngredientForm").valid()){ 

                                var formData = {
                                'item_id': $("#selectIng").val(),
                                'item_quantity': $("#qty").val(),
                                'dish_id': dish_id
                                };
                                
                                $.ajax({
                                        type :'POST',
                                        url : '/api/ingredients/',
                                        data : formData,
                                        dataType: 'json',
                                        success:(json) =>{
                                                jsonData = json.data;
                                                if(json.status) {
                                                        $("#ingredientsModal").modal('hide');
                                                        $("#modal-title").html(`
                                                            Add Ingredient!!
                                                        `);
                                                        $('#modal-body').html(`
                                                        Ingredient successfully Added!
                                                    `);
                                                    $("#modal").modal('show');
                                                }
                                                else {
                                                        $("#ingredientsModal").modal('hide');
                                                        $("#modal-title").html(`
                                                            Add Ingredient!!
                                                        `);
                                                        $('#modal-body').html(`
                                                        Error while adding the Ingredient. Please Try Again!
                                                    `);
                                                    $("#modal").modal('show');
                                                }

                                        }
                                });



                        }
                        e.preventDefault();
                   });

        $('#edit-ing-form').validate({
                rules: {
                        quantity: {
                                required: true,
                                min: 0                                     
                        }
                },      
                    messages: {
                        quantity: {
                                required: "Please enter quantity",
                                min: "Quantity must be greater than 0"
                        }
                }
                    
        });

        
        $("#editModal").on('show.bs.modal', function (e) {
                var triggerLink = $(e.relatedTarget);
                var name = triggerLink.data("name");
                var unit = triggerLink.data("unit");
                var quantity = triggerLink.data("quantity");
                
                $("#ing-name").val(name); 
                $("#ing-unit").val(unit);
                $("#ing-quantity").val(quantity);

                $("#edit-ing").data('dish_id', triggerLink.data("id"));
                $("#edit-ing").data('item_id', triggerLink.data("item_id"));
        });

                $("#edit-ing").click(function(e){
                        if($("#edit-ing-form").valid()) {
                        var dish_id = $(this).data('dish_id');
                        var item_id = $(this).data('item_id');

                   var formData = {
                               'dish_id' : dish_id,
                               'item_quantity': $("#ing-quantity").val(),
                               'item_id': item_id
                       }

                        $.ajax({
                                type: "PUT",
                                url: '/api/ingredients/edit',
                                data: formData,
                                dataType: 'json',
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#editModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Edit Ingredient!!
                                                `);
                                                $('#modal-body').html(`
                                                Ingredient Edited successfully Added!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                        else {
                                                $("#editModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Edit Ingredient!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Editing the Ingredient. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                }
                               });
                       
                }
                e.preventDefault();
                });

        });

function getIngredientType(e) {
    $.ajax({
            type :'GET',
            url : '/api/ingredients/type',
            success:(json) =>{
                jsonData = json.data;
                var x ="", i;

                for (i=0; i<jsonData.length; i++) {
                    x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";
      
                }
                elem = document.getElementById("ingType");
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


function getDishType(e) {
    $.ajax({
            type :'GET',
            url : '/api/dishType/',
            success:(json) =>{
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
                // elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
            }
    });
}

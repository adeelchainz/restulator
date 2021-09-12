$(document).ready(function() {

        $("#modal").on('hidden.bs.modal', function () {
                window.location.reload();
        });

        $("#alert-success").hide();
        $("#alert-danger").hide();
        $("#quantity-danger").hide();
        $("#success-dish2").hide();
        $("#dish-danger2").hide();

        var t =  $('#dataTable').DataTable( { 
        "columnDefs": [ {
                "searchable": true,
                "orderable": true,
                "targets": 0
                } ],
        "order": [],  
        "ajax": {         
                type :'GET',
                url : '/api/nonPaid/',
                dataType: 'json',
                            
        }, 
        "columns": [
        {"data": "id"},
        {"data": "customer_name"},
        { "data":"table_number"},
        { "data": "waiter_name"},
        { "data": "bill"},
        { "data": "cook_name"},
        { "data": "order_status"},
        {"data":"id","render": function (data, type, row, meta ) {

                return '<button type="button" id="'+ data +' "class="btn btn-primary badge-pill edit mr-1 mt-2" data-toggle="modal"  data-order_id="'+data+'" data-cook_name="'+row.cook_name+'" data-waiter_name="'+row.waiter_name+'" data-table_number="'+row.table_number+'" data-order_status="'+row.order_status+'"  data-target="#editModal">Edit&nbsp<i class="fas fa-edit"></i></button>' +
                '<button type="button" id="'+ data +' "class="btn btn-success badge-pill dish mr-1 mt-2" data-toggle="modal"  data-order_id="'+data+'" data-name="'+row.name+'" data-price="'+row.price+'" data-description="'+row.description+'" data-type="'+row.type+'" data-type_id="'+row.type_id+'"  data-target="#dishModal" style="margin-left:2px";>Add&nbsp<i class="fa fa-plus"></i></button>' +
                '<button id="'+ data + '" class="btn btn-info badge-pill info mr-1 mt-2" type="button" style="margin-left:2px";>Payment&nbsp<i class="fas fa-info-circle"></i></button>' + 
                '<button type="button" id="'+ data +' "class="btn btn-danger badge-pill delete mt-2" data-toggle="modal"  data-order_id="'+data+'"  data-target="#deleteModal" style="margin-left:2px";>Delete&nbsp<i class="fas fa-trash-alt"></i></button>';
                    
        }
            }
        ],
        "columnDefs": [
                { "width": "38%", "targets": 7 }
              ]           
        });

        t.on( 'order.dt search.dt', function () {
                t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
                } );
        } ).draw();

        $(document).on('click','.info',function(e){

                var order_id = $(this).attr("id");
                window.localStorage.setItem("order_id", order_id);
                location.href = "/orders/payment-order";

        });

        $("#deleteModal").on('show.bs.modal', function (e) {
            var triggerLink = $(e.relatedTarget);
            $("#del-dish").data('order_id', triggerLink.data("order_id")); 
            
        });

            $("#del-dish").click(function(e){
                var order_id = $(this).data('order_id');

            $.ajax({
                    url:"/api/nonPaid/" + order_id,
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

        $('#editDishForm').validate({
                rules: {
                        dishType: "required",
                        selectDish: "required",
                        qty: {
                                required: true,
                                min: 1                                     
                },

                    },
                    messages: {
                        dishType: {
                            required: "Please Select  Dish Type"
                            
                        },      
                        selectDish: "Please select any dish",
                        qty: {
                                required: "Please enter quantity",
                                min: "Quantity must be greater than 0"
                        }
                    }
                    
        });
        $("#dishModal").on('show.bs.modal', function (e) {
                var triggerLink = $(e.relatedTarget);
                $("#dish-btn").data('order_id', triggerLink.data("order_id"));
        });

        $("#dish-btn").click(function(e){
                var possible_dishes4 = parseInt(window.localStorage.getItem("possible_dishes3"));
                var dish_quantity = $("#qty").val();

                        if($("#editDishForm").valid()){
                                if(possible_dishes4 > 0) {
                                        if(possible_dishes4 >= dish_quantity ) {
                                                if(dish_quantity == Math.floor(dish_quantity)) {
                var order_id = $(this).data('order_id');

                var formData= {
                        'order_id' : order_id,
                        'total_amount': $('#total-price').val(),
                        'dish_id': $('#selectDish').val(),
                        'dish_quantity': $("#qty").val()
                };

                        $.ajax({
                                type :'POST',
                                url : '/api/nonPaid/',
                                data : formData,
                                dataType: 'json',
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#dishModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Dish To Order!!
                                                `);
                                                $('#modal-body').html(`
                                                Dish successfully Added!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                        else {
                                                $("#dishModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Dish To Order!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Adding the Dish. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                }
                        });
                        $("#success-dish2").hide();
                        $("#dish-danger2").hide();
                        $("#alert-success").show();
                        var divData=document.getElementById("alert-success");
                        divData.innerHTML="Dish Added Successfully";
                }
                else {
                        $("#success-dish2").hide();
                        $("#dish-danger2").show();
                        var divData=document.getElementById("dish-danger2");
                        divData.innerHTML="Decimal values are not allowed! Please enter a valid number";
        
                }
        }
        else {
                $("#success-dish2").hide();
                $("#dish-danger2").show();
                var divData=document.getElementById("dish-danger2");
                divData.innerHTML="Dishes Quantity should be less than or equal to ("+possible_dishes4+"). Please try again!";   
        }
        
        }
        else {
                $("#success-dish2").hide();
                $("#dish-danger2").show();
                var divData=document.getElementById("dish-danger2");
                divData.innerHTML="Dish is not available! Please select some other dish";


        }
                
           }
         

        e.preventDefault();

        }); 

        $('#edit-NonPaidForm').validate({
                rules: {
                        table: {
                                required: true,
                                min: 0                                     
                        },
                        kitchen: "required",
                        served: "required",
                        status: "required"
                    },
                    messages: {
                        table: {
                                required: "Please enter table number",
                                min: "Quantity must be greater than 0"
                        }
                    }
                    
        });
        
        $("#editModal").on('show.bs.modal', function (e) {
                var triggerLink = $(e.relatedTarget);
                var table_number = triggerLink.data("table_number");
                var order_status = triggerLink.data("order_status");
                var cook_name = triggerLink.data("cook_name");
                var waiter_name = triggerLink.data("waiter_name");
                
                getCook();
                getWaiter();

                $("#status").val(order_status); 
                $("#kitchen").val(cook_name);
                $("#served-by").val(waiter_name);
                $("#table-number").val(table_number);

                getTables();

                $("#edit-order").data('order_id', triggerLink.data("order_id"));
        });

                $("#edit-order").click(function(e){
                        if($("#edit-NonPaidForm").valid()) {
                                var table_number = $("#table-number").val();
                                if(table_number == Math.floor(table_number)) {
                                var order_id = $(this).data('order_id');

                   var formData = {
                               'order_id' : order_id,
                               'order_status': $("#status").val(),
                               'cook_id': $("#kitchen").val(),
                               'waiter_id': $("#served-by").val(),
                               'table_number': $("#table-number").val()
                       }

                        $.ajax({
                                type: "PUT",
                                url: '/api/nonPaid/',
                                data: formData,
                                dataType: 'json',
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#editModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Edit Order Details!!
                                                `);
                                                $('#modal-body').html(`
                                                Order successfully Edited!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                        else {
                                                $("#editModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Edit Order Details!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Editing the Order Details. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                }
                               });
                        }
                        else {
                                $("#quantity-danger").show();
                                var divData=document.getElementById("quantity-danger");
                                divData.innerHTML="Decimal values are not allowed! Please enter a valid number";   
                        }
                       

                }
                e.preventDefault();
                });

        $("#dishType").change(function dish(e){
                $("#selectDish").children('option:gt(0)').hide();
                $('#selectDish').val("");
                $("#price").val("");
                var dishType_id  = $("#dishType").val();                         
                $.ajax({
                                type :'GET',
                                url : '/api/dish/' + dishType_id,
                                success:(json) =>{
                                        jsonData = json.data;
                                        var x ="", i;
                                        for (i=0; i<jsonData.length; i++) {
                                                x = x + "<option value=" + jsonData[i].name + ">" + jsonData[i].description + "</option>";
                                        }
                                        elem = document.getElementById("selectDish");
                                        $("#selectDish").children('option:gt(0)').hide();

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
        });

        $("#selectDish").change(function(e){
                var dish_id = $("#selectDish").val();
                $.ajax({
                                      type :'GET',
                                      url : '/api/dish/dishPrice/' + dish_id,
                                      async:false,
                                      success:(json) =>{
                                              jsonData = json.data;
                                              var x ="", i;                                                 
                                              for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                                      $("#price").val(jsonData[i].price);                                                        
                                              } 
                                      }
                              });
              });

              

        $("#qty").change(function(e){
                var quantity = $("#qty").val();
                var price = $("#price").val();
                var totalPrice = quantity * price;
                $("#total-price").val(totalPrice);

                var dish_id = $("#selectDish").val();

                var formData = {
                        'quantity': quantity
                }

                $.ajax({
                       type :'POST',
                       url : '/api/ingredients/check/quantity/' + dish_id,
                       data: formData,
                       success: function(json) {
                               if(json.status) {
                                jsonData = json.data;
                                var possible_dishes = jsonData[0].possible;
                                window.localStorage.setItem("possible_dishes3", possible_dishes);                                                                                         
                                document.getElementById("check-quantity").innerHTML = Math.floor(jsonData[0].possible);

                               }

                               else {
                                $("#modal-title").html(`
                                                Get Dish Type!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while getting the Dish Type. Please Try Again!
                                        `);
                                        $("#modal").modal('show');

                               }
                               
                       }
               });
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
                                        elem = document.getElementById("dishType");
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
                                        $("#modal-title").html(`
                                                Get Dish Type!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while getting the Dish Type. Please Try Again!
                                        `);
                                        $("#modal").modal('show');
                
                                }
                                
                        }
                });
};

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
                                                Get Cook Data!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while getting the Cook Data. Please Try Again!
                                        `);
                                        $("#modal").modal('show');
                
                                }
                               
                        }
                });
 }

 function getTables(e) {
        $.ajax({
                        type :'GET',
                        url : '/api/tables',
                        success:(result) =>{

                                if(result.status) {
                                        jsonData = result.data;
                                        var x ="", i;

                                for (i=0; i<jsonData.length; i++) {
                                        x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].id + "</option>";            
                                }
                                elem = document.getElementById("table-number")

                                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                        var option = document.createElement('option'); // create the option element
                                        option.value = jsonData[i].id; // set the value property
                                        option.appendChild(document.createTextNode(jsonData[i].id)); // set the textContent in a safe way.
                                        df.appendChild(option); // append the option to the document fragment
                                }
                                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                                }

                                else {
                                        $("#myModal").modal('hide');
                                        $("#modal-title").html(`
                                                Get Table Data!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while getting the Tables Data. Please Try Again!
                                        `);
                                        $("#modal").modal('show');
                
                                }
                                
                        }
                });
 }


 function getWaiter(e) {
        $.ajax({
                        type :'GET',
                        url : '/api/employeeCategory/getWaiter',
                        success:(json) =>{
                                if(json.status) {
                                        jsonData = json.data;
                                        var x ="", i;
        
                                        for (i=0; i<jsonData.length; i++) {
                                                x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";            
                                        }
                                        elem = document.getElementById("served-by")
        
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
                                                Get Waiter Data!!
                                        `);
                                        $('#modal-body').html(`
                                        Error while getting the Waiter Data. Please Try Again!
                                        `);
                                        $("#modal").modal('show');
                
                                }
                                
                        }
                });
 }


$(document).ready(function(){

        var orderInfo = {
                dishesInfo:[],
                dishIdInfo: {},
                dishQuantity : {} 
        };

        var amount = 0;

        var t =  $('#dataTable').DataTable( { 
                "columnDefs": [ {
                    "searchable": true,
                    "orderable": true,
                    "targets": 0
                    } ],
            "order": [[ 0, 'asc' ]]
        }); 
        

        $("#modal").on('hidden.bs.modal', function () {
                window.location.reload();
        });

        $('#myModal').on('shown.bs.modal', function () {
                $('#selectDish').val("");
                $("#qty").val("");
                $("#dishType").val("");
                $("#total-price").val("");
                $("#price").val("");

                $("#dish-danger").hide();
                $("#alert-success").hide();
                $("#alert-danger").hide();
                $("#dish-success").hide();
                $("#error-date").hide();
                $("#dish-danger").hide();
                $("#error-dishes").hide();
                $("#success-dish").hide();
                $("#dish-danger2").hide();
                $("#success-dish2").hide();
        });

        $("#alert-success").hide();
        $("#alert-danger").hide();
        $("#dish-success").hide();
        $("#error-date").hide();
        $("#dish-danger").hide();
        $("#error-dishes").hide();
        $("#success-dish").hide();
        $("#dish-danger2").hide();
        $("#success-dish2").hide();

        getTables(); 

        $("#dishType").change(function(e){
        $("#selectDish").children('option:gt(0)').hide();
        $('#selectDish').val("");

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
        $("#cancel").click(function(e){
        location.reload();
        });

                 $("#selectDish").change(function(e){
                   var dish_id = $("#selectDish").val();
                   var quantity = $("#qty").val();

                   $.ajax({
                                         type :'GET',
                                         url : '/api/dish/dishPrice/' + dish_id,
                                         success:(json) =>{
                                                 jsonData = json.data;
                                                 var x ="", i;                                                 
                                                 for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                                        $("#price").val(jsonData[i].price); 
                                                        var price = $("#price").val();
                                                        var totalPrice = quantity * price;
                                                        $("#total-price").val(totalPrice);                                                       
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
                                        jsonData = json.data;
                                        var possible_dishes = jsonData[0].possible;
                                        window.localStorage.setItem("possible_dishes", possible_dishes);                                                                                         
                                        document.getElementById("check-quantity").innerHTML = Math.floor(jsonData[0].possible);
                                }
                        });   
                 });
                
                 function calculateTotal_price(total) {
                         var sum = total.reduce(function(a, b){
                                 return a + b;
                         }, 0);
                        return sum;
                }
        
                var x = [];
                var formData = {};
                var dishesObj = {};                 

                                $('#editEmptForm').validate({
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
                                var inc=0;
                                var dishes = []
                                

                               $("#editEmp").click(function(e){

                                        var possible_dishes2 = parseInt(window.localStorage.getItem("possible_dishes"));
                                        var quantity = $("#qty").val();
                                        
                                   if($("#editEmptForm").valid()){
                                        if(possible_dishes2 > 0) {
                                           if(possible_dishes2 >= quantity) {  
                                                   if(quantity == Math.floor(quantity)) {
                                        formData = {
                                        'dish_id': $("#selectDish").val(),
                                        'dish_quantity': $("#qty").val(),
                                        };

                                        var dish_name = $("#selectDish").find('option:selected').text();
                                        var quantity = $("#qty").val();
                                        var total_price = $("#total-price").val();
                                        var price = $("#price").val();
                                        var dish_id = $("#selectDish").val();
                                        window.localStorage.setItem("dish_id_modal", dish_id);
                                        dish_type = $("#dishType").find('option:selected').text();

                                        orderInfo.dishesInfo.push(
                                                [orderInfo.dishesInfo.length+1,
                                                dish_name,dish_type, quantity, price, total_price,
                                                getButtonForIndex(orderInfo.dishesInfo.length)
                                        ] );

                                        orderInfo.dishIdInfo[dish_name] = dish_id;

                                        t.row.add( orderInfo.dishesInfo[orderInfo.dishesInfo.length-1] ).draw( false );

                                        if (!dishesObj[formData['dish_id']]) {
                                                dishesObj[formData['dish_id']] = parseInt(formData['dish_quantity']);
                                                var total_price = $("#total-price").val();
                                                x.push(parseInt(total_price));
                                                amount = calculateTotal_price(x);

                                                $("#dish-danger").hide();
                                                if (this.id == 'editEmp') {
                                                        $("#success-dish").show();
                                                        var modal_success =document.getElementById("success-dish");
                                                        modal_success.innerHTML="Dish Successfully Added!";
        
                                                        $("#error-date").hide();
                                                        $("#error-dishes").hide();
                                                        $("#dish-success").show();
                                                
                                                        inc=inc+1;
                                                        inc=parseInt(inc);
                                                        var divData=document.getElementById("dish-success");
                                                        divData.innerHTML="Total Dish(es) Successfully Added! ("+inc +")";//this part has been edited
                 
                                                        }
                                        }

                                        else if(dishesObj[formData['dish_id']] && (dishesObj[formData['dish_id']] + parseInt(formData['dish_quantity'])) > possible_dishes2) {
                                                let total = (dishesObj[formData['dish_id']]) + parseInt(formData['dish_quantity']);

                                                $("#success-dish").hide();
                                                $("#dish-danger").show();
                                                var divData=document.getElementById("dish-danger");
                                                divData.innerHTML="Your Total count for this dish is " + total + " Please provide dish count less than or equal to " + possible_dishes2;

                                        }

                                        else {
                                                dishesObj[formData['dish_id']] += parseInt(formData['dish_quantity']);
                                                var total_price = $("#total-price").val();
                                                x.push(parseInt(total_price));
                                                amount = calculateTotal_price(x);

                                                $("#dish-danger").hide();
                                                if (this.id == 'editEmp') {
                                                        $("#success-dish").show();
                                                        var modal_success =document.getElementById("success-dish");
                                                        modal_success.innerHTML="Dish Successfully Added!";
        
                                                        $("#error-date").hide();
                                                        $("#error-dishes").hide();
                                                        
                                                        $("#dish-success").show();
                                                        
        
                                                        inc=inc+1;
                                                        inc=parseInt(inc);
                                                        var divData=document.getElementById("dish-success");
                                                        divData.innerHTML="Total Dish(es) Successfully Added! ("+inc +")";//this part has been edited
                 
                                                }
                                        }

                                        for(var i in dishesObj){
                                                dishes.push([i, dishesObj[i]]);
                                       }   

                                        $('#selectDish').val("");
                                        $("#qty").val("");
                                        $("#dishType").val("");
                                        $("#total-price").val("");
                                        $("#price").val("");
         
                                }
                                else {
                                        $("#success-dish").hide();
                                        $("#dish-danger").show();
                                        var divData=document.getElementById("dish-danger");
                                        divData.innerHTML="Decimal values are not allowed! Please enter a valid number";   
                                }
                        }
                                else {
                                        $("#success-dish").hide();
                                        $("#dish-danger").show();
                                        var divData=document.getElementById("dish-danger");
                                        divData.innerHTML="Dishes Quantity should be less than or equal to ("+possible_dishes2+"). Please try again!";   
                                }
                                       
                                }
                                       
                                else {
                                        $("#success-dish").hide();
                                        $("#dish-danger").show();
                                        var divData=document.getElementById("dish-danger");
                                        divData.innerHTML="Dish is not available! Please select some other dish";
                                }

                                }
                                e.preventDefault();
                           });

                        $("#editModal").on('show.bs.modal', function (e) {
                                var index = e.relatedTarget.id;
                                index = index.replace("edit-", "");

                                $("#dish-price").val(orderInfo.dishesInfo[index][4]); 
                                $("#dish-totalPrice").val(orderInfo.dishesInfo[index][5]);
                                $("#dish-name").val(orderInfo.dishesInfo[index][1]);
                                $("#dish-quantity").val(orderInfo.dishesInfo[index][3]);
                                $("#dish-type").val(orderInfo.dishesInfo[index][2]);
                                $("#editDish").data("index", index);
                                $("#editDish").data("total-price", $("#dish-totalPrice").val(orderInfo.dishesInfo[index][5]));
                                
                        });
                
                        $("#addOrderForm").submit(function(e){

                                var time_order = new Date($("#order-time").val());
                                 var conv_order =  time_order.getFullYear() + "-" + (time_order.getMonth()+1) + "-"+time_order.getDate()  +  ' '+ time_order.toTimeString().split(' ')[0];                      
                                 var time_complete = new Date($("#complete-time").val());
                                 var conv_complete =  time_complete.getFullYear() + "-" + (time_complete.getMonth()+1) + "-"+time_complete.getDate()  +  ' '+ time_complete.toTimeString().split(' ')[0];
                                 var customer = $("#customer").val();
                                 window.localStorage.setItem('customer',JSON.stringify(customer));

                                var dishes = []
                                var final_dishes = [];

                                for(var i in dishesObj){
                                        dishes.push([i, dishesObj[i]]);
                                }   

                                for (var j=0; j < orderInfo.dishesInfo.length; j++) {
                                        if(!orderInfo.dishQuantity.hasOwnProperty( orderInfo.dishIdInfo[orderInfo.dishesInfo[j][1]])) {
                                                orderInfo.dishQuantity[orderInfo.dishIdInfo[orderInfo.dishesInfo[j][1]]] = parseInt(orderInfo.dishesInfo[j][3]);
                                        }
                                        else {
                                                orderInfo.dishQuantity[orderInfo.dishIdInfo[orderInfo.dishesInfo[j][1]]] += parseInt(orderInfo.dishesInfo[j][3]); 
                                        }

                                }

                                for(var i in orderInfo.dishQuantity){
                                        final_dishes.push([i, orderInfo.dishQuantity[i]]);
                                }

                            if(conv_complete > conv_order) { 
                                if(dishes.length > 0) {
                                 var formData1 = {
                                 'table_number': $("#select-table").val(),
                                 'cook_id': $("#cook").val(),
                                 'waiter_id': $("#waiter").val(),
                                 'total_amount': amount,
                                 'order_status': $("#order-status").val(),
                                 'order_time': conv_order,
                                 'complete_time': conv_complete,
                                 'customer_id': customer,
                                 'dishes': final_dishes
                                }

                                 $.ajax({
                                 url: '/api/order/',
                                 type: 'POST',
                                 data: formData1,
                                 dataType: 'json',
                                 success: (data) => {
                                        if(data.status) {
                                                var socket = io();
                                                socket.emit('alert kitchen', data.data); //data[0].data.insertid
                                                $("alert-danger").hide(); 
                                                $("#error-date").hide();
                                                $("#error-dishes").hide();                                               
                                                $("#alert-success").show();

                                                $("#modal-title").html(`
                                                    Place Order!!
                                                `);
                                                $('#modal-body').html(`
                                                Order successfully Placed!
                                            `);
                                            $("#modal").modal('show');

                                            window.location.reload();

                                        }
                                        else {
                                                $("#modal-title").html(`
                                                    Place Order!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Placing the Order. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                 }				
                                });
                        }
                        else {
                                $("#error-date").hide();
                                $("#error-dishes").show();
                        }
                }
                        else {
                                $("#error-dishes").hide();
                                $("#error-date").show();  
                        }
                        e.preventDefault();
                        });
                
                window.localStorage.removeItem("possible_dishes");
 
$("#view-order").click(function(e){
     
        var customer = JSON.parse(window.localStorage.getItem('customer'));

        t.draw();
        });
        
        $("#dish-quantity").change(function(e){
                var quantity = $("#dish-quantity").val();
                var dish_id = window.localStorage.getItem("dish_id_modal");

                var formData = {
                        'quantity': quantity
                }

                $.ajax({
                       type :'POST',
                       url : '/api/ingredients/check/quantity/' + dish_id,
                       data: formData,
                       success: function(json) {
                               jsonData = json.data;
                               var possible_dishes3 = jsonData[0].possible;
                               window.localStorage.setItem("possible_dishes3", possible_dishes3);                                                                                         
                               document.getElementById("check-quantity2").innerHTML = jsonData[0].possible;
                               $("#dish-totalPrice").val($("#dish-price").val() * quantity);
                       }
               });
        });
       
        $("#deleteModal").on('show.bs.modal', function(e) {
                var triggerLink = $(e.relatedTarget);
                var dish_id = triggerLink.data("id");
                var dish_quantity  = triggerLink.data("dish_quantity");
                var price = triggerLink.data("price");

                var index = e.relatedTarget.id;

                $("#del-dish").data("index", index);
        
        });
        $("#del-dish").click(function(e){
                var index = $(this).data("index");
                index = index.replace("delete-", "");
                var prev = orderInfo.dishesInfo[index];

                delete orderInfo.dishesInfo[index];

                orderInfo.dishesInfo = orderInfo.dishesInfo.filter(item => item !== undefined);

                t.clear();

                for (var i= 0; i < orderInfo.dishesInfo.length; i++) {
                        orderInfo.dishesInfo[i][0] = (i+1);
                        orderInfo.dishesInfo[i][6] = getButtonForIndex(i);

                        t.row.add(orderInfo.dishesInfo[i]);
                }

                t.draw();

        });
        
        function getButtonForIndex(index) {
               return `<button type="button" id="edit-${index}"
               class="btn btn-primary badge-pill edit mr-1 mt-2" data-toggle="modal" 
               data-target="#editModal">Edit&nbsp<i class="fas fa-edit"></i></button>
               <button type="button" id="delete-${index}"
               class="btn btn-danger badge-pill delete mt-2" data-toggle="modal"
               data-target="#deleteModal" style="margin-left:2px";>Delete&nbsp<i 
               class="fas fa-trash-alt"></i></button>`;


        }

                $('#editDishForm').validate({
                        rules: {
                                quantity:  {
                                        required: true,
                                        min: 1,
                                        step: false
                                                                      
                        },
 
                            },
                            messages: {
                                quantity: {
                                        required: "Please enter quantity",
                                        min: "Quantity must be greater than 0"
                                }
                            }
                            
                });

                $("#editDish").click(function(e){
                        var index = $(this).data("index");
                        
                        index = index.replace("edit-", "");
                        var prev = orderInfo.dishesInfo[index][3];

                        orderInfo.dishesInfo[index][3] = $("#dish-quantity").val();

                        orderInfo.dishesInfo[index][5] = $("#dish-totalPrice").val();

                        orderInfo.dishesInfo[index][4] = $("#dish-price").val();
                         
                        t.row(index).data(orderInfo.dishesInfo[index]);

                        let totalPrice = $("#dish-totalPrice").val();

                        let finalPrice = amount;

                        finalPrice = finalPrice - (finalPrice - totalPrice);

                        x[orderInfo.dishesInfo[index][0] -1] = finalPrice;

                        amount = calculateTotal_price(x);
                        $("#editModal").hide();       
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
                                                        x = x + "<option value=" + jsonData[i].type_id+ ">" +  jsonData[i].type + "</option>";         
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
                                                $("#myModal").modal('hide');
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
                         getCook();
                         getWaiter();
                         getCustomer();
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
                                                 elem = document.getElementById("cook");
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
                                                $("#myModal").modal('hide');
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
                                url : '/api/tables/availableTables',
                                success:(result) =>{

                                        if(result.status) {
                                                jsonData = result.data;
                                                var x ="", i;
        
                                        for (i=0; i<jsonData.length; i++) {
                                                x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].id + "</option>";            
                                        }
                                        elem = document.getElementById("select-table")
        
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
                                        elem = document.getElementById("waiter")
        
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
                                        $("#myModal").modal('hide');
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
 function getCustomer() {
    $.ajax({
                    type :'GET',
                    url : '/api/customer/',
                    success:(json) =>{

                        if(json.status) {
                                jsonData = json.data;
                                var x ="", i;
    
                                for (i=0; i<jsonData.length; i++) {
                                    x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";                                    
                                }
                                elem = document.getElementById("customer")
    
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
                                        Get Customer Data!!
                                `);
                                $('#modal-body').html(`
                                Error while getting the Customer Data. Please Try Again!
                                `);
                                $("#modal").modal('show');
        
                        }
                        
                    }
            });
}
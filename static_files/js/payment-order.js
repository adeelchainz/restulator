
        $(document).ready(function() {
               
        $("#alert-success").hide();
        $("#alert-danger").hide();
        $("#dish-danger").hide();
        $("#success-dish").hide();

            var order_id = localStorage.getItem("order_id");
            var customer = JSON.parse(window.localStorage.getItem('customer'));

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
            "order": [[ 1, 'asc' ]],  
            "ajax": {         
                    type :'GET',
                    url : '/api/nonPaid/payment-order/' + order_id,
                    dataType: 'json',
                    "dataSrc": function ( json ) {
                        //Make your callback here.
                        objectLength = Object.keys(json.data).length;

                        if(objectLength >= 1) {
                                document.getElementById("total-bill").innerHTML = json.data[0].bill;
                                var tax = json.data[0].tax * 100;
                                document.getElementById("tax").innerHTML = tax;

                                document.getElementById("total-price").innerHTML = json.data[0].total_amount;
                                document.getElementById("tax1").innerHTML = tax;
                                document.getElementById("bill").innerHTML = json.data[0].bill;
                                return json.data;
                        }
                        else {
                                return json.data
                        }
                    }                              
            },
            "columns": [
            {"data": "dish_id"},
            { "data":"dish_name"},
            { "data": "type"},
            {"data": "dish_quantity"},
            { "data":'price'},
            {"data":"id","render": function (data, type, row, meta ) {
               return row.dish_quantity * row.price;
               }
            },
            {"data":"order_id","render": function (data, type, row, meta ) {
                    return '<button type="button" id="'+ data +' "class="btn btn-primary badge-pill edit mr-2 mt-2" data-toggle="modal"  data-dish_id="'+row.dish_id+'" data-order_id="'+data+'" data-dish_quantity="'+row.dish_quantity+'" data-dish_name="'+row.dish_name+'" data-price="'+row.price+'" data-type_id="'+row.type_id+'" data-type="'+row.type+'"  data-bill="'+row.bill+'"  data-total_amount="'+row.total_amount+'"  data-tax="'+row.tax+'"  data-target="#editModal"><i class="fas fa-edit"></i></button>' +
                     '<button type="button" id="'+ data +' "class="btn btn-danger badge-pill delete mt-2" data-toggle="modal"  data-dish_id="'+row.dish_id+'" data-order_id="'+row.order_id+'" data-dish_quantity="'+row.dish_quantity+'" data-price="'+row.price+'"  data-target="#deleteModal"><i class="fa fa-trash-alt"></i></button>';
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
                $("#del-dish").data('dish_id', triggerLink.data("dish_id")); 
                $("#del-dish").data('dish_quantity', triggerLink.data("dish_quantity")); 
                $("#del-dish").data('price', triggerLink.data("price")); 

             });
        
        $("#del-dish").click(function(e){
                var order_id = $(this).data('order_id');
                var dish_id = $(this).data('dish_id');
                var dish_quantity = $(this).data('dish_quantity');
                var price = $(this).data('price');

                var total_price = dish_quantity * price;

                var formData = {};
                 formData = {
                       'order_id': order_id,
                       'dish_id': dish_id,
                       'total_price': total_price
                };   

                        $.ajax({
                                type :'DELETE',
                                url : '/api/order/',
                                data : formData,
                                dataType: 'json',
                                success:(data) =>{
                                        window.location.reload();
                                }
                        });
                e.preventDefault();
                }); 

            $("#dish-quantity").change(function(e){
                var quantity = $("#dish-quantity").val();
                var price = $("#dish-price").val();
                var totalPrice = quantity * price;
                $("#dish-totalPrice").val(totalPrice);
                
                var dish_id = window.localStorage.getItem("id_dish");

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
                               document.getElementById("check-quantity").innerHTML = Math.floor(jsonData[0].possible);
                       }
               });
                
              });

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


      $("#editModal").on('show.bs.modal', function (e) {
        var triggerLink = $(e.relatedTarget);
        var dish_id = triggerLink.data("dish_id");
        var dish_name  = triggerLink.data("dish_name");
        var dish_quantity  = triggerLink.data("dish_quantity");
        var price  = triggerLink.data("price");
        var type  = triggerLink.data("type");

        window.localStorage.setItem("id_dish", dish_id);
        
        var dish_totalPrice = dish_quantity * price;
        $("#dish-name").val(dish_name); 
        $("#dish-type").val(type);
        $("#dish-quantity").val(dish_quantity);
        $("#dish-price").val(price);

        $("#editDish").data('order_id', triggerLink.data("order_id")); 
        $("#editDish").data('dish_id', triggerLink.data("dish_id")); 
        $("#editDish").data('dish_totalPrice', dish_totalPrice);
      });
        
        $("#editDish").click(function(e){
                var possible_dishes4 = parseInt(window.localStorage.getItem("possible_dishes3"));
                var dish_quantity = $("#dish-quantity").val();

                if($("#editDishForm").valid()){
                        if(possible_dishes4 > 0) {
                                if(possible_dishes4 >= dish_quantity ) {
                                        if(dish_quantity == Math.floor(dish_quantity)) {

                var order_id = $(this).data('order_id');
                var dish_id = $(this).data('dish_id');
                var dish_totalPrice = $(this).data('dish_totalPrice');

                var total_amount = parseInt($("#dish-totalPrice").val());
                var order_totalAmount = dish_totalPrice - total_amount;
                
                var formData = {
                        'order_id': order_id,
                        'dish_id': dish_id,
                        'dish_quantity': $("#dish-quantity").val(),
                        'total_amount': order_totalAmount
                };
                        $.ajax({
                                type :'PUT',
                                url : '/api/order/',
                                data : formData,
                                dataType: 'json',
                                success:(data) =>{
                                        window.location.reload();

                                }
                        });

                        if (this.id == 'editDish') { 
                                $("#dish-danger").hide();
                                $("#success-dish").show(); 
                                var success_modal=document.getElementById("success-dish");
                                success_modal.innerHTML="Dish Updated Successfully";
                        }
                }
                else {
                        $("#success-dish").hide();
                        $("#dish-danger").show();
                        var divData=document.getElementById("dish-danger");
                                divData.innerHTML="Decimal values are not allowed! Please enter a valid number";

                }
        
                }
                else {
                        $("#success-dish2").hide();
                        $("#dish-danger").show();
                        var divData=document.getElementById("dish-danger");
                        divData.innerHTML="Dishes Quantity should be less than or equal to ("+possible_dishes4+"). Please try again!";   
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
          
        $("#payment").change(function(e){
                var bill = parseInt(document.getElementById("bill").innerText);
                var payment = parseInt($("#payment").val());
                var change = payment - bill;

                $("#change").val(change);

        });

        $("#bill-payment-form").submit(function(e) {
                var payment = parseInt($("#payment").val());
                var formData = {
                        'payment': payment
                }
                var change = parseInt($("#change").val());
                
           if(change >= 0) {
                $.ajax({
                        type: 'POST',
                        url: '/api/nonPaid/payment-order/payment/' + order_id,
                        dataType:'json',
                        data: formData,
                        success:(json) => {
                                jsonData = json.data[0];
                                
                                if(jsonData) {
                                      $("#alert-success").show();
                                      location.href = "/accounting/income";
                                }

                        }

                });
                e.preventDefault();

                }

                else {
                        $("#alert-danger").show();
                        window.location.reload();
                }


        });

        $("#review").click(function(e) {
                $("#add-review").modal('toggle');
            });

        $('#add-review-form').validate({
        rules: {
                rating: "required",
                ratingText: "required"

                },
                messages: {
                rating: {
                        required: "Please enter quantity"
                },
                ratingText: "Please provide a Review"
                }
                
        });

        $("#addReviewButton").click(function(e) {
                if($("#add-review-form").valid()){
                       var formData = {
                               order_id: order_id,
                               review: $("#order-review").val(),
                               rating: $("#order-rating").val()
                       }

                       $.ajax({
                               type: 'POST',
                               url: '/api/review/',
                               data: formData,
                               dataType: 'json',
                               success: (data) => {
                                       window.location.reload();
                               }
                       });
                       e.preventDefault();
                }
        });


});

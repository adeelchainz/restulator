$(document).ready(function() {
    var tab = $('#supplies_dataTable').DataTable({                    
        "columnDefs": [ {
                            "searchable": true,
                            "orderable": true,
                            "targets": 0
                        }
                     ],
                    "order": [[ 0, 'asc' ]], 
                    "dataSrc": 'data',                     
                    "ajax": {         
                            type :'GET',
                            url : '/api/itemFromSupply/',
                            dataType: 'json',                                                                                                                   
                    },
                    "columns": [
                        {"data":"SupplyId","render": function ( data, type, row, meta ) {                                    
                                return row.SupplyId;}},
                        {"data":"SupplierName","render": function ( data, type, row, meta ) {                                    
                            return row.SupplierName;}},
                        {"data": "supply_at","render": function ( data, type, row, meta ) {
                            var date_formatted = new Date(row.supply_at);
                            var conv_date2 =  date_formatted.getUTCFullYear() + "-" + (date_formatted.getUTCMonth()) + "-"+date_formatted.getUTCDate()  +  ' '+ date_formatted.getUTCHours() + ':' + date_formatted.getUTCMinutes() + ':' + date_formatted.getUTCSeconds()                                    
                            var date_string =  date_formatted.getUTCDate() + "-"+ date_formatted.toLocaleString('default', { month: 'short' }) +"-" + date_formatted.getFullYear();
                            return date_string;}},
                        {"data": "item_name","render": function ( data, type, row, meta ) {
                            return row.item_name;}},
                        {"data": "quantity","render": function ( data, type, row, meta ) {
                            return row.quantity;}},
                        {"data": "unit_price","render": function ( data, type, row, meta ) {
                            return row.unit_price;}},                                                                  
                        {"data": "bill","render": function ( data, type, row, meta ) {
                            return row.bill;}},
                        {"data": "payment","render": function ( data, type, row, meta ) {
                            return row.payment;}},                                    
                        {"data": "payment_status","render": function ( data, type, row, meta ) {
                            return row.payment_status;}},  
                        {"data":"id","render": function (data, type, row, meta ) {        
                                return '<button id="item' + row.id + '" data-id= \"' + row.SupplyId + '\" class="btn btn-danger" data-toggle="modal" data-target="#supplyDeleteModal"><i class="far fa-trash-alt"></i></button> <button class=\"btn btn-success\"   id=" ' 
                                + row.id  + '" data-id="'+row.SupplyId+'" data-toggle="modal" data-target="#supplyEditModal"  data-supplier="' +row.SupplierName+ '" data-supplier_id="'+row.supplier_id+'"  data-supply_at="'+row.supply_at +'" data-item_id="' +row.item_id +'"    data-item_name="'+row.item_name+'" data-quantity="'+row.quantity+
                                '" data-unit_price="'+row.unit_price+'" data-bill="'+row.bill+'" data-payment="'+row.payment+'" data-payment_status="'+row.payment_status+'" ><i class="fas fa-edit"></i></button>'}}                                                                                                                                                              

                    
                    



                    ]

    });
//     tab.on( 'order.dt search.dt', function () {
//                 tab.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
//                 cell.innerHTML = i+1;
//                 } );
//         } ).draw();

        console.log("Table rows: " + tab.rows().count());

        $.ajax({
                        type :'GET',
                        url : '/api/item/',
                        // async:true,
                        // dataType: 'json',

        }).done(function(data){
                if(data.data){
                        
                        elem = document.getElementById("items_editlist")
                        // console.log(data.data);
                        // console.log(data.data[0].id + " " + data.data[0].name);

                        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                        for (var i = 0; i < data.data.length; i++) { 
                                var option = document.createElement('option'); // create the option element
                                option.value = data.data[i].id; 
                                option.appendChild(document.createTextNode(data.data[i].name)); 
                                df.appendChild(option); 
                        }
                        elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
                                
                        
                }
                else{
                        window.alert('Network Error! Try Again!');                        
                }
        }).fail(function() {
                window.alert('Network Error! Try Again!');
        });
               
        $.ajax({
                        type :'GET',
                        url : '/api/supplier/',
                }).done(function(data){
                        if(data.data){
                                
                                elem = document.getElementById("supplierName_editlist")
                                // console.log(data.data);
                                // console.log(data.data[0].id + " " + data.data[0].name);

                                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                for (var i = 0; i < data.data.length; i++) { 
                                        var option = document.createElement('option'); // create the option element
                                        option.value = data.data[i].id; 
                                        option.appendChild(document.createTextNode(data.data[i].name)); 
                                        df.appendChild(option); 
                                }
                                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
                           
                        }
                        else{
                                window.alert('Network Error! Try Again!');                        
                        }
                }).fail(function() {
                        window.alert('Network Error! Try Again!');
                });

        

$("#supplyEditModal").on('show.bs.modal', function (e) {
        var triggerLink = $(e.relatedTarget);
        var supplyId = triggerLink.data("id");
        var supplierNameResult = triggerLink.data("supplier");
        var supplierIdResult = triggerLink.data("supplier_id");
        var supplyAtResult = triggerLink.data("supply_at");
        var itemNameResult = triggerLink.data("item_name");
        var itemIdResult = triggerLink.data("item_id");
        var quantityResult = triggerLink.data("quantity");
        var unitPriceResult = triggerLink.data("unit_price");
        var billResult = triggerLink.data("bill");
        var paymentResult = triggerLink.data("payment");
        var paymentStatusResult = triggerLink.data("payment_status");



        console.log("Item " + itemIdResult);
        console.log("Supplier Id " + supplierIdResult);
        console.log("SupplierName" + supplierNameResult);
        var date = new Date(supplyAtResult);
        var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];
        var conv_date2 =  (date.getUTCMonth()+1) + "/" +date.getUTCDate()+"/"+ date.getUTCFullYear() + " "+ date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
        
        console.log(conv_date2);
        $('#supplierName_editlist').val(supplierIdResult).prop('selected',true);  
        //      append('<option selected value="'+ supplierNameResult+'">'+supplierNameResult+'</option>');
        $('#datetimeSupplyEdit').val(conv_date2);
        $('#items_editlist').val(itemIdResult).prop('selected',true);
        //    append('<option selected value="'+ itemNameResult+'">'+itemNameResult+'</option>');
        $('#quantityEdit').val(quantityResult);
        $('#unitPriceEdit').val(unitPriceResult);
        $('#billAmountEdit').prop('readonly',false);
        $('#billAmountEdit').val(billResult);
        $('#billAmountEdit').prop('readonly',true);
        $('#paymentAmountEdit').val(paymentResult);
        $('#paymentStatus_editlist').val(paymentStatusResult).prop('selected',true);


        $(function () { 
                $("#supplyEditForm").validate({

                        rules: {
                                datetimeSupplyEdit : "required",
                                paymentAmountEdit: {
                                        required : true,
                                        min : 1                                         
                                },
                                quantityEdit : {
                                        required : true,
                                        min : 1 
                                },
                                unitPriceEdit : {
                                        required : true,
                                        min : 1                                         
                                }


                        },
                        messages:{
                                datetimeSupplyEdit : "Please select datetime of supply",
                                paymentAmountEdit : {
                                        required : " Please provide Payment Amount",
                                        min : "Please enter payment amount greater than zero"                                        
                                },
                                quantityEdit : {
                                        required : "Please provide Quantity",
                                        min : "Please enter Quantity greater than zero"
                                },
                                unitPriceEdit : {
                                        required : "Please provide Unit Price",
                                        min : "Please enter Unit Price greater than zero"
                                }


                        }


                });
        });



        $("#supplyEditButton").click(function(e){

                if($("#supplyEditForm").valid()){
                        //  if(document.getElementById("paymentAmountEdit").value == ""){
                        //         document.getElementById('paymentAmountEdit').style.borderColor = "red";
                        //         window.alert("Please Enter Payment Amount");
                
                        // }
                        
                        
                        // else{
                                var date = new Date($('#datetimeSupplyEdit').val());
                                var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];
                                supplyEditObj = {
                                        supplier_id:$('#supplierName_editlist').val(),
                                        supply_at: conv_date,  
                                        item_id : $('#items_editlist').val(),   
                                        quantity:$('#quantityEdit').val(),
                                        unit_price:$('#unitPriceEdit').val(),
                                        bill: $('#billAmountEdit').val(),
                                        payment: $('#paymentAmountEdit').val(),
                                        payment_status:$('#paymentStatus_editlist').val()
        
        
        
        
                                }
        
        
        
                                
                                console.log("Supply id: " + supplyId);

                                $.ajax({
                                        type :'PUT',
                                        url : '/api/itemFromSupply/' + supplyId,
                                        data: supplyEditObj,

                                }).done(function(data){
                                        if(data.data){
                                                // console.log("Supply inserted");
                                            window.location.reload();
                    
                    
                    
                                        }
                                        else{
                                                window.alert('Network Error! Try Again!');
                       
                                        }
                                }).fail(function(){
                                    window.alert('Network Error! Try Again!');
                    
                                });
                                e.preventDefault(); 

                        // }                        

                       


                
        }

        });                












});




        
$("#supplyDeleteModal").on('show.bs.modal', function (e) {
        var triggerLink = $(e.relatedTarget);
        var buttonID = triggerLink.data("id");
        console.log(buttonID);
        $(this).find(".modal-body").html('Are you sure you want to delete this? <button class="btn btn-success" type="button" data-dismiss="modal" onclick="Delete_supply('+buttonID+')">Delete</button>');
        




});

});
function calculateBill(){
        if(document.getElementById("unitPriceEdit").value == "" || document.getElementById("quantityEdit").value == "" ){
                document.getElementById('unitPriceEdit').style.borderColor = "red";
                document.getElementById('quantityEdit').style.borderColor = "red";                        
                alert("Please Enter Quantity and Unit Price");

        }
        else{
                var num = document.getElementById("unitPriceEdit").value * document.getElementById("quantityEdit").value;
                console.log("Bill amount" + num);
                $('#billAmountEdit').prop('readonly',false);
                $('#billAmountEdit').val(num);
                $('#billAmountEdit').prop('readonly',true);                        
                // document.getElementById("billAmount").innerHTML = num;



        }



}        


function Delete_supply(buttonId){
        console.log("Supply-info ID:" + buttonId);

                $.ajax({
                        url:"/api/itemFromSupply/" + buttonId,
                        method: "DELETE",                                        
                }).done(function(data){
                        if(data.data){
                                // console.log("Supply inserted");
                            window.location.reload();
    
    
    
                        }
                        else{
                                window.alert('Network Error! Try Again!');
       
                        }
                }).fail(function(){
                    window.alert('Network Error! Try Again!');
    
                });
                window.location.reload();                

};



$(document).ready(function(){
    // $('#datetimepicker1').datetimepicker();
    
                $("#alert-success").hide();
                $("#alert-danger").hide();
    
            $.ajax({
                    type :'GET',
                    url : '/api/item/',
                    // dataType: 'json',
                    success:(data) =>{
                            console.log(data.data.length);
                            elem = document.getElementById("items_selectlist")
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
    
    
    
            });
            var token = window.localStorage.getItem('token');
    
            $.ajax({
            type :'GET',
            url : '/api/supplier',
            // dataType: 'json',
            success:(data) =>{
                    console.log(data.data.length);
                    elem = document.getElementById("supplier_selectlist")
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
    
    
    
            });  
            $("#supplyAddForm").submit(function(e){
            console.log("Date " + $("#datetimeSupply").val());
            var date = new Date($("#datetimeSupply").val()); 
    
            var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];                      
            console.log("converted date: " + conv_date );
    
    
    
            console.log("Bill amount " + $('#billAmount').val());
            console.log("Payment status " + $("#payment_status_selectlist").val());
            console.log("item id: " + $("#items_selectlist").val());
    
            var supplyForm_obj = {
                    supplier_id :$("#supplier_selectlist").val(),
                    supply_at: conv_date,
                    item_id:$("#items_selectlist").val(),
                    quantity:$("#item_quantity").val(),
                    unit_price:$("#item_unitPrice").val(),
                    bill: $('#billAmount').val(),
                    payment: $("#payment").val(),
                    payment_status: $("#payment_status_selectlist").val()
    
            };
            console.log(supplyForm_obj);
    
    
            $.ajax({
                    type :'POST',
                    url : '/api/itemFromSupply/',
                    data : supplyForm_obj
            }).done(function(data){
                    if(data.data){
                            console.log("Supply inserted");
                        window.location.reload();
                        $("#alert-success").show();                                        



                    }
                    else{
                        $("#alert-danger").show();
   
                    }
            }).fail(function(){
                window.alert('Network Error! Try Again!');

            });                                        
    
    
    
             
            e.preventDefault();                       
    
    
    
            });
    
    
    
    
    
    
    
    
});


function calculateBill(){
        if(document.getElementById("item_unitPrice").value == "" || document.getElementById("item_quantity").value == ""){
        document.getElementById('item_unitPrice').style.borderColor = "red";
        document.getElementById('item_quantity').style.borderColor = "red";                        
        alert("Please Enter Quantity and Unit Price");

    }
    else{
        var num = document.getElementById("item_unitPrice").value * document.getElementById("item_quantity").value;
        console.log("Bill amount" + num);
        $('#billAmount').prop('readonly',false);
        $('#billAmount').val(num);
        $('#billAmount').prop('readonly',true);                        
        // document.getElementById("billAmount").innerHTML = num;



    }


};
    
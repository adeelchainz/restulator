$(document).ready(function(){

    let supplyId = window.localStorage.getItem("supply_id");
    
    $.ajax({
        url: '/api/supply_expense/'+supplyId,
        type: 'GET'
    }).done(function(result){
        if(result.data[0]){
            $('#purseId').text(supplyId);
            $('#suppliedBy').text(result.data[0].SupplierName);
            $('#bill_field').text(result.data[0].bill);
            $('#payment_field').text(result.data[0].payment);
            $('#payment_status_field').text(result.data[0].payment_status);

            MM = ["January", "February","March","April","May","June","July","August","September","October","November", "December"]

            formattedDate = result.data[0].supply_at.replace(
                /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\w{1})/,
                function($0,$1,$2,$3,$4,$5,$6){
                    return MM[$2-1]+" "+$3+", "+$1+" "+$4%12+":"+$5+(+$4>12?" PM":" AM") 
                }
            )            
            $('#supplyDateField').text(formattedDate);


        }
    }).fail(function() {
        window.alert('Network Error! Try Again!');
    });


    var s = $("#itemSuppliesTable").DataTable({ 
        dom: 'Bfrtip',
        buttons: [
        'copy', 'csv', 'excel', 'pdf','print'
        ],                                 
        ajax: {
            url: "/api/supply_expense/items/"+supplyId,
            type: "GET",

        }, 
        columnDefs: [ {
            "searchable": true,
            "orderable": true,
            "targets": 0
            } ],
        "order": [[ 1, 'asc' ]],             
        dataSrc: 'data',
        columns: [
            {data: 'Product_Name'},
            {data: 'Item_Quantity'},
            {data: 'Unit_Price'},
        ]
    }); 
    




});
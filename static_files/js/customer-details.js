$(document).ready(()=>{
    const customerId = $('#test_div').data("id");
    console.log("Customer ID:" + customerId);

    $.ajax({
        url: '/api/customer/' + customerId,
        type: 'GET'
    }).done(function(result){
        console.log(result);
        if (result.data){
            customer_info = result.data[0] 
            $('#name_field').text(customer_info.name);
            $('#email_field').text(customer_info.email);
            $('#points_field').text(customer_info.points);

        }
        else window.alert('Network Error!');
    }).fail(function() {
        window.alert('Network Error!');
    });




    var t =  $('#OrdersDatatable').DataTable( { 
            "columnDefs": [ {
                "searchable": true,
                "orderable": true,
                "targets": 0
                } ],
        "order": [[ 1, 'desc' ]],  
        "ajax": {         
                type :'GET',
                url : '/api/customer/orders/'+customerId,
                dataType: 'json',                                              
        }, 
        "columns": [
    {"data":"id"},            
    {
        render: function (data, type, row) {

            MM = ["January", "February","March","April","May","June","July","August","September","October","November", "December"]

            xx = row.OrderAt.replace(
                /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\w{1})/,
                function($0,$1,$2,$3,$4,$5,$6){
                    return MM[$2-1]+" "+$3+", "+$1+" "+$4%12+":"+$5+(+$4>12?" PM":" AM") // AM PM can be removed if 24-hour format is used.
                }
            )
            return xx;
            
        }        
    },
    {"data":"id","render": function (data, type, row, meta ) {
        return '<button type="button" id="'+ data.id +' "class="btn btn-primary badge-pill edit mt-2" data-toggle="modal"  data-id="'+row.id+'" data-target="#dishesModal">View&nbsp<i class="fas fa-eye"></i></button>';
        }
    },
    {"data": "Bill"},
    {"data": "Payment_Status"}
    ],
    "columnDefs": [
    { "width": "18%", "targets": 4 }
    ]    
    }
    );

    t.on( 'order.dt search.dt', function () {
    t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    cell.innerHTML = i+1;
    } );
    } ).draw();    



    $("#dishesModal").on('hidden.bs.modal',function(e){
        
        //$("#suppliesTable").dataTable().fnDestroy();
        $("#dishesTable").DataTable().clear().destroy();
    });

    $("#dishesModal").on('show.bs.modal',function(e){
        var orderId = $(e.relatedTarget).data("id");
        console.log("Order id" + orderId);
        console.log("Order Id" + orderId);
        var s = $("#dishesTable").DataTable({
            dom: 'Bfrtip',
            buttons: [
            'copy', 'csv', 'excel', 'pdf','print'
            ],             
            "pageLength": 5,
            ajax: {
                url: "/api/customer/dishes/"+orderId,
                type: "GET",
            },
            dataSrc: 'data',
            columns: [
                {data:'id'},
                {data: 'DishName'},
                {data: 'Quantity'},
                {data: 'Price'},

            ]
        });
        s.columns.adjust();
        s.on( 'order.dt search.dt', function () {
            s.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
            } );
        }).draw();
    });    

});
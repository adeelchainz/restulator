$(document).ready(function(){
    var cookId = 27;
    var current_cook_id = $('#test_div').data("id");


    var s = $("#cookHistoryTable").DataTable({
        ajax: {
            url: `/api/cook-report/cook-history/${current_cook_id}`,
            type: "GET",

        },
        dataSrc: 'data',
        columns: [
            {data: 'Order_id'},
            {data: 'Order_at'},
            {data: 'Served_by'},
            {data:'Status'}
        ]
    });





});
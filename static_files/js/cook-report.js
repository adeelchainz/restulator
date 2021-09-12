

$(document).ready(()=>{

    var date_input1 = $('#date1');
    var date_input2 = $('#date2');

    var options = {
      todayHighlight: true,
      autoclose: true,
    };
    date_input1.datepicker(options);
    date_input2.datepicker(options);




    var chart;
    var chart1Data;
    $("#dataTable").hide();


    $.ajax({
        url: '/api/cook-report/',
        type: 'GET'
      }).done(function(result){
        if(result.status){
            
            chart1Data = result.data;

            // populate the dropdown list with waiter names. 
            for (var i = 0; i < result.data.length ; i++){
                $("#select-list-dropdown")[0].options[$("#select-list-dropdown")[0].options.length]= new Option(result.data[i].Name);
            }
            
        }
        else {
            console.log(result.data);
        }
      }).fail(function() {
        window.alert('Network Error! Try Again!');
    });



    $("#btn").on('click', function(e){
        var start_date = new Date('01/01/1970');
        start_date = (((start_date.getMonth() > 8) ? (start_date.getMonth() + 1) : 
                        ('0' + (start_date.getMonth() + 1))) + '/' + ((start_date.getDate() > 9) ? start_date.getDate() : 
                            ('0' + start_date.getDate())) + '/' + start_date.getFullYear()).replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");


        var end_date = new Date();

        end_date = 
        (((end_date.getMonth() > 8) ? (end_date.getMonth() + 1) : 
            ('0' + (end_date.getMonth() + 1))) + '/' + ((end_date.getDate() > 9) ? end_date.getDate() :
            ('0' + end_date.getDate())) + '/' + end_date.getFullYear()).replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");



        // display feedback of assigning default dates.
        if(!date_input1.val() || !date_input2.val()){

            var nullDates = 
            date_input1.val()? 'End Date': 
                date_input2.val()?'Start Date' : 'Start Date and End Date';

            $("#error").html(`Setting default values for <i>${nullDates}</i>`);
        }
        else {
            $("#error").html('');
        }

        // if date text boxes are empty, assign the default dates.
        if (date_input1.val()){
            start_date = date_input1.val().replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        }
        else {
            date_input1.val((((new Date('01/01/1970').getMonth() > 8) ? (new Date('01/01/1970').getMonth() + 1) : ('0' + (new Date('01/01/1970').getMonth() + 1))) + '/' + ((new Date('01/01/1970').getDate() > 9) ? new Date('01/01/1970').getDate() : ('0' + new Date('01/01/1970').getDate())) + '/' + new Date('01/01/1970').getFullYear()));
        }


        // assign default dates to text boxes.
        if (date_input2.val()){
            end_date = date_input2.val().replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
        }
        else {
            date_input2.val((((new Date().getMonth() > 8) ? (new Date().getMonth() + 1) : ('0' + (new Date().getMonth() + 1))) + '/' + ((new Date().getDate() > 9) ? new Date().getDate() : ('0' + new Date().getDate())) + '/' + new Date().getFullYear()));
        }



        if(!chart){
            chart = anychart.column();
            chart.container("container");
            chart.animation(true);
        }
        


        var selected = $("#select-list-dropdown option:selected").text();
        var rows = [];
        var id;
        var heading = "";


        if (selected == "All Cooks"){
            $("#dataTable").DataTable().clear().destroy();
            $("#dataTable").hide();

            // chart1Data has record of each waiter hence its length is the total 
            // number of waiters. 
            
            var totalDatatablesContent = "";
            for (var i = 0; i < chart1Data.length; i++){

                var dataTableHtml = `
                <h5 style="padding-bottom: 20px;padding-top: 50px;">${chart1Data[i].Name}</h5>
                    <table id="dataTable${i}" class="display" style="width:100%;">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Customer</th>
                            <th>Cook</th>
                            <th>Waiter</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>`;

                totalDatatablesContent += dataTableHtml;
            }


            $("#multipleDatatables").html(totalDatatablesContent);

            for (var i = 0; i < chart1Data.length; i++){

                var s = $(`#dataTable${i}`).DataTable({
                    ajax: {
                        url: `/api/cook-report/${chart1Data[i].id}/${start_date}/${end_date}`,
                        type: "GET"
                    },
                    dataSrc: 'data',
                    columns: [
                        {
                            "render": function ( data, type, full, meta ) {
                                return  meta.row + 1;
                            } 
                        },
                        {data: 'Customer'},
                        {data: 'Cook'},
                        {data: 'Waiter'},
                        {data: 'Total Amount'},
                        {data: 'Date'}
                    ],
                    destroy: true
                });

                //rows = [selected, table.data().count()]
                s.columns.adjust();

                s.on('order.dt search.dt', function () {
                    s.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();


                s.on('xhr', function (e, settings, json){
                    rows.push([json.data[0].Cook, json.data.length]);
                    if(i >= chart1Data.length - 1){

                        heading = "The number of orders cooked by each cook";

                        var data = {
                            header: ["Cook Name", "Orders Cooked"],
                            rows: rows
                        }
                    
                        chart.xAxis().title("Cooks");
                        chart.yAxis().title("No. of Orders Cooked");
                        chart.data(data);
                
                        chart.title(heading);
                
                        chart.draw();
                    }

                });
            }

        }
        else {
            
            $("#multipleDatatables").html("");

            for (var i = 0;i < chart1Data.length; i++) if(chart1Data[i].Name == selected) id = chart1Data[i].id;

            heading = "The number of orders cooked by: " + selected;
            $("#dataTable").show();


            var s = $("#dataTable").DataTable({
                ajax: {
                    url: `/api/cook-report/${id}/${start_date}/${end_date}`,
                    type: "GET"
                },
                dataSrc: 'data',
                columns: [
                    {data: 'id'},
                    {data: 'Customer'},
                    {data: 'Waiter'},
                    {data: 'Cook'},
                    {data: 'Total Amount'},
                    {data: 'Date'}
                ],
                destroy: true,
            });
            
            s.columns.adjust();

            s.on( 'order.dt search.dt', function () {
                s.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();

            s.on('xhr', function (e, settings, json){

                rows = [
                    [selected, json.data.length]
                ];
                var data = {
                    header: ["Cook Name", "Orders Cooked"],
                    rows: rows
                }
            
                chart.xAxis().title("Cooks");
                chart.yAxis().title("No. of Orders Cooked");
                chart.data(data);
        
                chart.title(heading);
        
                chart.draw();
            });
        }
    });
});
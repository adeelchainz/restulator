$(document).ready(()=>{

    var data;
    $.ajax({
        url: '/api/income/',
        type: 'GET'
    }).done(function(result){
        if(result.status){

            //data = result.data.sort(sortData);
            data = result.data;
            var groups = groupBy(data);

            var sorted = Object.keys(groups).sort(function(a,b) {
                a = a.split("-");
                b = b.split("-");
                return new Date(a[1], a[0], 1) - new Date(b[1], b[0], 1);
            });
            multiDatatable(groups, sorted);

        }
    }).fail(function() {
        window.alert('Network Error! Try Again!');
    });
});
function generateDatatable(dataTableName, data){

    $(`#${dataTableName}`).dataTable( {
        dom: 'Bfrtip',
        buttons: [
        'copy', 'csv', 'excel', 'pdf','print'
        ],         
        data: data,
        columns: [
            {
                "render": function ( data, type, full, meta ) {
                    return  meta.row + 1;
                } 
            },
            { data: "bill" },
            { data: "payment" },
            { data: "table_number" },
            { data: "tax" },
            { data: "total_amount" },
            { data: "date" }
        ]
    });

}
function sortData(a, b){
  const date1  = new Date(a.date);
  const date2 = new Date(b.date);

  let comparison = 0;
  if (date1 < date2) {
    comparison = 1;
  } else if (date1 > date2) {
    comparison = -1;
  }
  return comparison;
}

function groupBy(data){
    let group = data.reduce((r, a) => {
        r[`${new Date(a.date).getMonth()+1}-${new Date(a.date).getYear()}`] = [...r[`${new Date(a.date).getMonth()+1}-${new Date(a.date).getYear()}`] || [], a];
        return r;
    }, {});
    return group; 
}

function multiDatatable(objectOfData, sortedKeys){
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var totalDatatablesContent = "";
    for (var i = sortedKeys.length-1; i >= 0; i--){

        
        

        var dataTableHtml = `
        <h5 id="heading${i}" style="padding-bottom: 20px;padding-top: 50px;"></h5>
            <table id="dataTable${i}" class="display" style="width:100%;">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Bill</th>
                    <th>Payment</th>
                    <th>Table No.</th>
                    <th>Tax</th>
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
                    <td></td>
                </tr>
            </tfoot>
        </table>`;

        totalDatatablesContent += dataTableHtml;
        

        $("#multipleDatatables").html(totalDatatablesContent);
    }

    for(var i = 0; i < sortedKeys.length; i++){

        var data = objectOfData[sortedKeys[i]];
        var sum = 0;
        data.forEach((element)=>{
            sum += element.payment;
        });
        $(`#heading${i}`).html(`${monthNames[sortedKeys[i].split('-')[0] - 1]} ${Number(sortedKeys[i].split('-')[1]) + 1900} - <i> Total Income: ${sum}/- PKR. </i>`);
        generateDatatable(`dataTable${i}`, data);
    }

}
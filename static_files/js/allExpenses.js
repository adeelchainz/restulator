$(document).ready(function(){

    var data;

    $.ajax({
        url: '/api/expenses/',
        type: 'GET'
    }).done(function(result){
        if(result.status){

            // data = result.data.sort(sortData);
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
            { data: "Month" },
            { 
                "render": function ( data, type, row, meta ) {
                    if(row.Expense_Type === 'purse' || row.Expense_Type === 'Purse'){
                        return  '<button  id=\"purseButton\" data-id= \"' + row.Type_id + '\" class="btn expenseDetail" onClick="sendExpenseId(this)" >'+ row.Expense_Type+ ' <i class="fa fa-external-link-alt"> </i></button>';
                    }
                    else{
                        return  row.Expense_Type;
                    }
            
                }
            },    
            { data: "Value" },
            { data: "date" },
        ]
    });

}

function sendExpenseId(elem){
    var supply_id = $(elem).data("id");
    window.localStorage.setItem("supply_id", supply_id);
    location.href = "/accounting/expense/all-expenses/expense-detail";


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
          r[`${new Date(a.Month).getMonth()+1}-${new Date(a.Month).getYear()}`] = [...r[`${new Date(a.Month).getMonth()+1}-${new Date(a.Month).getYear()}`] || [], a];
          return r;
      }, {});
      return group; 
  }
  
  function multiDatatable(objectOfData, sortedKeys){
      
      const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
  
      var totalDatatablesContent = "";
      for (var i = sortedKeys.length-1; i >= 0; i--){
  
          
          
  
          var dataTableHtml = `
          <div class="table-responsive">
          <h4 id="heading${i}" style="padding-bottom: 20px;padding-top: 50px;"></h4>
              <table id="dataTable${i}" class="display" style="width:100%;">
              <thead>
                  <tr>
                      <th>No.</th>
                      <th>Month</th>
                      <th>Expense Type</th>
                      <th>Value</th>
                      <th>Date (mm/dd/yyy)</th>
                  </tr>
              </thead>
              <tfoot>
                  <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                  </tr>
              </tfoot>
          </table>
          </div>`;
  
          totalDatatablesContent += dataTableHtml;
          
  
          $("#multiple_expense_datatables").html(totalDatatablesContent);
      }
  
      for(var i = 0; i < sortedKeys.length; i++){
  
          var data = objectOfData[sortedKeys[i]];
          var sum = 0;
          var purse_sum = 0, salary_sum=0;
          data.forEach((element)=>{
              sum += element.Value;
              if(element.Expense_Type === 'purse'){
                purse_sum += element.Value;
                }
                else if(element.Expense_Type === 'salary'){
                    salary_sum += element.Value;
                }              
          });
          $(`#heading${i}`).html(`${monthNames[sortedKeys[i].split('-')[0] - 1]} ${Number(sortedKeys[i].split('-')[1]) + 1900}
           - <small> Total Expense:</small> ${sum}/- PKR  <br> <h6 style="padding-top:10px;"> Purse Expanses: ${purse_sum}/- PKR | Office Expanses: ${salary_sum}/- PKR. </h6>`);
          generateDatatable(`dataTable${i}`, data);
      }
      
  
  }
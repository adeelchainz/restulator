$(document).ready(function(){
    var data;

    $.ajax({
        url: '/api/salary/all-salaries',
        type: 'GET'
    }).done(function(result){
        if(result.status){

            data = result.data;

            var groups = groupBy(data);

            var sorted = Object.keys(groups).sort(function(a,b) {
                a = a.split("-");
                b = b.split("-");
                return new Date(a[1], a[0], 1) + new Date(b[1], b[0], 1);
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
            { data: "EmployeeName" },
            {data: "SalaryAmount"},
            {data: "Month"},
            {data: "Status"}
        ]
    });

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
      for (var i = 0; i < sortedKeys.length; i++){
  
          
          
  
          var dataTableHtml = `
          <div class="table-responsive">
          <h4 id="heading${i}" style="padding-bottom: 20px;padding-top: 50px;"></h4>
              <table id="dataTable${i}" class="display" style="width:100%;">
              <thead>
                  <tr>
                      <th>No.</th>
                      <th>Employee Name</th>
                      <th>Salary Amount</th>
                      <th>Month</th>
                      <th>Status</th>
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
          
  
          $("#multiple_salaries_datatables").html(totalDatatablesContent);
      }
  
      for(var i = 0; i < sortedKeys.length; i++){
  
          var data = objectOfData[sortedKeys[i]];
          var sum = 0;
          var purse_sum = 0, salary_sum=0;
        //   data.forEach((element)=>{
            //   sum += element.Value;
            //   if(element.Expense_Type === 'purse'){
            //     purse_sum += element.Value;
            //     }
            //     else if(element.Expense_Type === 'salary'){
            //         salary_sum += element.Value;
            //     }              
        //   });
          $(`#heading${i}`).html(`${monthNames[sortedKeys[i].split('-')[0] - 1]} ${Number(sortedKeys[i].split('-')[1]) + 1900}`);
            // - <small> Total Expense:</small> ${sum}/- PKR  <br> <h6 style="padding-top:10px;"> Purse Expanses: ${purse_sum}/- PKR | Office Expanses: ${salary_sum}/- PKR. </h6>`
          generateDatatable(`dataTable${i}`, data);
      }
      
  
  }
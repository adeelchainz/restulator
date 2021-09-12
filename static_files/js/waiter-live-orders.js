function markCompleted(btnId){

    var orderId = parseInt(btnId.replace("btn-",""));

      //update status to cooked and delete order id from live kitchen.
    
      $("#modal-status-body").html(`
        Are you sure you want to mark the order as served?
      `);
      $("#delete-btn").html(`
        Mark as Served
      `);
  
      $("#confirm-delete").modal('show');
  
  
      $("#delete-btn").click(function (e){
        $.ajax({
  
          url: `/api/waiter-live-orders`,
          type: 'DELETE',
          data: {
            id: orderId
          }
  
          }).done(function(result){
  
          //console.log(result);
          if(result.status)window.location.reload();
          else window.alert("Couldn't mark served, try again!");
  
          }).fail(function() {
  
          window.alert('Network Error!');
  
        });
      });
     
  }
  
  
  const container = document.getElementById('accordion');
  
  $(document).ready(()=>{

    $(".btn btn-primary").click(function(e){
      markCompleted(e.id);
    });

    var waiter_id = $('#test_div').data("id");
    
    
    var socket = io().connect();
  
    $.ajax({
      url: `/api/waiter-live-orders/${waiter_id}`,
      type: 'GET'
    }).done(function(result){
      if(result.status){
        if (result.data.length > 0){
          populateCards(result.data);
          document.getElementById("total-orders").innerHTML += result.data.length;
        }
        else {
          window.alert('No orders found for the current waiter!');
        }
      }
      else {
        window.alert('Server side error! Refresh or try later!');
      }
    }).fail(function() {
      window.alert('Network Error!');
    });
  
  
    var content = ""
  
    socket.on('alert waiter',(alert_data)=>{
      //window.alert();
      $("#status-modal-body2").html(`
            <p>Status of <b>Order No: ${alert_data[0]}</b> has changed, it is now <b>${alert_data[1]}</b>
            </p>
      `);
  
  
          $('#status-modal2').modal('show');

      var btnId = $(`#btn-${alert_data[0]}`);

      if (btnId){

        if (alert_data[1] == 'cooked'){
          btnId.removeClass(btnId.attr('class')).addClass('btn btn-primary');
          btnId.html(`<b>Cooked, click here when Served</b>`);
          //btnId.on('click',markCompleted(`btn-${alert_data[0]}`, 'cooked'));
          btnId.click(function(e){
            markCompleted(`btn-${alert_data[0]}`);
          });
        }

        else {
          btnId.removeClass(btnId.attr('class')).addClass('btn btn-warning disabled');
          btnId.html(`<b>${alert_data[1][0].toUpperCase()+alert_data[1].slice(1)}, Kindly Wait!</b>`);
        }

      }

    });
  
    socket.on('new order added', (msg)=>{
      

      $.ajax({
  
        url: `/api/waiter-live-orders/${waiter_id}/${msg}`,
        type: 'GET',
  
      }).done(function(result){
  
        //window.alert(Object.keys(result));
        if(result.status && result.data){
  
          $(".modal-body").html(`
            <p><b>Order No: ${msg}, Table Number: ${result.data.table_number}</b>,
                is placed at the bottom, to sort it according to its complete time click <b><i>Sort or Continue</i></b> with the current sequence.
            </p>
          `);
  
  
          $('#modal').modal('show');
  
          $("#sort").click(function(){
            window.location.reload();
          });
  
          appendNewOrder(result.data);
          var title = document.getElementById("total-orders");
          var text = title.innerHTML
          var splitted = text.split(":");
          title.innerHTML = splitted[0] +": "+ (parseInt(splitted[1])+1);
        }
        if(!result.status){
          window.alert('Server side error occurred! Refresh page or try later.');
        }
  
      }).fail(function() {
  
        window.alert('Network Error! Refresh the page or try later!');
  
      });
  
    });
    
  });
  
  
  function populateCards(results){
    var times = [];
    //console.log(results);
  
    results.forEach((result, idx) => {
      
      var dishes = result.dishes.split(",");
      var quantity = result.dishes_quantity.split(",");
  
      var dishes_content = "";
      
      times.push(convertDate(result.complete_time));
  
      var i=0;
      dishes.forEach((dish)=>{
          dishes_content += `<li class="list-group-item"><p><b>${i+1}. Name: </b>${dish}</p><p><b>&nbsp&nbsp&nbsp&nbspQuantity: </b>${quantity[i]}</p></li>`
          i++;
      });
  
      var button;
      if (result.status  == 'cooked'){
        button = `
        <div class="btn btn-primary" id="btn-${result.id}" ><b>Cooked, click here when Served</b></div>
        `;
      }
      else {
        button = `
      <div class="btn btn-warning disabled" id="btn-${result.id}"><b>${result.status[0].toUpperCase()+result.status.slice(1)}, Kindly Wait!</b></div>
      `;
      }
  
      
      content = `
      
      <div class="col-sm-6">
      <div class="card">
      <h5 class="card-header"><b><i>Table No : ${result.table_number}</b></i></h5>
      <p class="card-header" id="timer${idx}"></p>
      <div class="card-body">
      
          <h6 class="card-subtitle mb-2 text-bold">Ordered at: ${convertDate(result.order_time).substring(0,convertDate(result.order_time).lastIndexOf('G'))}</h6>
          <h6 class="card-subtitle mb-2 text-bold">Complete before: ${convertDate(result.complete_time).substring(0,convertDate(result.complete_time).lastIndexOf('G'))}</h6>
          <p class="card-text">Order No: ${result.id}</p>
          <p class="card-text">Waiter Name: ${result.waiter}</p>
          <p class="card-text">Cook Name: ${result.cook}</p>
          <h5><b>Total Dishes - ${dishes.length}</b></h5>
          <ul class="list-group list-group-flush">
          ${dishes_content}
          </ul>
    </div>
    ${button}
    </div> 
    </div>
  
      `;
      // Append newyly created card element to the container
       container.innerHTML += content;
  
    });
  
    for(var i=0;i<times.length;i++){
      var time = new Date(times[i]);
      countdown(time, document.getElementById("timer"+i));
    }
  
  }
  
  
  
  function appendNewOrder(orderInfo){
  
  
    var dishes = orderInfo.dishes.split(",");
    var quantity = orderInfo.dishes_quantity.split(",");
  
      var dishes_content = "";
      var i=0;
      dishes.forEach((dish)=>{
          dishes_content += `<li class="list-group-item"><p><b>${i+1} Name: </b>${dish}</p><p><b>&nbsp&nbsp&nbsp&nbspQuantity: </b>${quantity[i]}</p></li>`;
          i++;
      });
  
  
      var button;
      if (orderInfo.status  == 'cooked'){
        button = `
        <div class="btn btn-primary" id="btn-${orderInfo.id}"><b>Cooked, click here when Served</b></div>
        `;
      }
      else {
        button = `
      <div class="btn btn-warning disabled" id="btn-${orderInfo.id}"><b>${orderInfo.status[0].toUpperCase()+orderInfo.status.slice(1)}, Kindly Wait!</b></div>
      `;
      }
  
    content = 
    `<div class="col-sm-6">
    <div class="card">
    <h5 class="card-header"><b><i>Table No : ${orderInfo.table_number}</i></b></h5>
    <p class="card-header" id="timer${orderInfo.id}"></p>
    <div class="card-body">
        
        <h6 class="card-subtitle mb-2 text-bold">Ordered at: ${convertDate(orderInfo.order_time).substring(0,convertDate(orderInfo.order_time).lastIndexOf('G'))}</h6>
        <h6 class="card-subtitle mb-2 text-bold">Complete before: ${convertDate(orderInfo.complete_time).substring(0,convertDate(orderInfo.complete_time).lastIndexOf('G'))}</h6>
        <p class="card-text">Order No: ${orderInfo.id}</p>
        <p class="card-text">Waiter Name: ${orderInfo.waiter}</p>
        <p class="card-text">Cook Name: ${orderInfo.cook}</p>
        <h5><b> Total Dishes - ${dishes.length}</b></h5>
        <ul class="list-group list-group-flush"> 
        ${dishes_content}
      </ul>
  </div>
  ${button}
  </div>
  </div>
    `;
    
    // Append newyly created card element to the container
    container.innerHTML += content;
  
    for(var i =0;i<=1;i++){
      var time = new Date(convertDate(orderInfo.complete_time));
      countdown(time, document.getElementById("timer"+orderInfo.id));
  
    }
    
  }
  
  
  
  
  function countdown(finish_date, timer){
  
    var x = setInterval(function() {
      var now = new Date().getTime();
  
      var distance = finish_date - now;
  
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      timer.innerHTML ="Remaining Time: " + days + "days " + hours + "hrs " + minutes + "min " + seconds + "sec";
  
      if (distance < 0) {
        clearInterval(x);
        timer.innerHTML = "Time's Up!";
      }
    }, 1000);
  }
  
  
  // function parseDateTime(dateTime){
  //   var MM = ["January", "February","March","April","May","June","July","August","September","October","November", "December"]
  
  //   var xx = dateTime.replace(
  //     /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\w{1})/,
  //     function($0,$1,$2,$3,$4,$5,$6){
  //       return MM[$2-1]+" "+$3+", "+$1+" at "+$4%12+":"+$5+(+$4>12?" PM":" AM") // AM PM can be removed if 24-hour format is used.
  //     }
  //   )
  //   return xx;
  // };
  
  function convertDate(date){
    var parseDate;
    var pattern = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\w{1})/;
    if (pattern.test(date)){
  
      parsedDate = date.replace(pattern, function($0,$1,$2,$3,$4,$5,$6){
        // Date(year, month, date, hours, minutes, seconds, milliseconds).
        return new Date($1,$2 - 1,$3,$4,$5,$6,0);
      });
      return parsedDate;
    }
    else {
      return "Invalid Date Time."
    }
  }
  
  
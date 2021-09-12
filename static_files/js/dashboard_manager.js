$(document).ready(function(){



    $.ajax({
        url: '/api/dashboard-manager/today-purses-total',
        type:'GET'

      }).done(function(result){
          console.log("Today's Purses" + result.data[0].total_supplies);
        // $("#total_purses").html(result.data[0]);
        if(result.data[0].total_supplies){
            document.getElementById('total_purses').innerHTML = '$' + result.data[0].total_supplies;
        }

            
        
      }).fail(function() {
        window.alert('Network Error! Try Again!');
    });

    $.ajax({
        url: '/api/dashboard-manager/today-total-orders',
        type:'GET'

      }).done(function(result){
          console.log("Today's Orders" + result.data[0].orders_today);
        // $("#total_purses").html(result.data[0]);
        if(result.data[0].orders_today){
            document.getElementById('total_orders').innerHTML = result.data[0].orders_today;

        }
            
        
      }).fail(function() {
        window.alert('Network Error! Try Again!');
    });    

    $.ajax({
        url: '/api/dashboard-manager/today-total-sell',
        type:'GET'

      }).done(function(result){
        //   console.log("Today's Sell" + result.data[0].orders_today);
        // $("#total_purses").html(result.data[0]);
        if(result.data[0].total_sell){
            document.getElementById('total_sell').innerHTML = '$' + result.data[0].total_sell;

        }        
      }).fail(function() {
        window.alert('Network Error! Try Again!');
    });

    $.ajax({
      url: '/api/dashboard-manager/dish-sells-today',
      type:'GET'

    }).done(function(result){
      $('#dish_sells').innerHTML = 'DISH SELLS TODAY';
      new Morris.Bar({
        element: dish_sells_chart,
        data: result.data,
        goalLineColors : ['red','green','blue'],
        xkey: 'Dish_Name',
        ykeys: ['Total_Order'],
        labels: ['Total Order'],
        barColors: ['#dc3545'],
        gridTextColor : '#000',
        gridTextSize: '15px',
        resize : true        
      });

      if(result.data > 0){
        $('#dish_sells').text('Today\'s Dish Sales') ;
      }
      

    }).fail(function() {
      window.alert('Network Error! Try Again!');
  });  
  
  $.ajax({
    url: '/api/dashboard-manager/waiter-orders-today',
    type:'GET'

  }).done(function(result){
    $('#waiter_orders').innerHTML = 'DAILY ORDER BY WAITER';
    new Morris.Bar({
      element: waiter_orders_chart,
      data: result.data,
      goalLineColors : ['red','green','blue'],
      xkey: 'Waiter_Name',
      ykeys: ['Total_Orders'],
      labels: ['Total_Orders'],
      barColors: ['#dc3545'],
      gridTextColor : '#000',
      gridTextSize: '15px',
      resize : true        


    });
    if(result.data > 0){
      $('#waiter_orders').text('Today\'s  Waiter Orders') ;    
    }
                
  }).fail(function() {
    window.alert('Network Error! Try Again!');
});

$.ajax({
  url: '/api/dashboard-manager/cook-orders-today',
  type:'GET'

}).done(function(result){
  $('#kitchen_orders_heading').innerHTML = 'DAILY ORDER BY KITCHEN'

  new Morris.Bar({
    element: kitchen_orders_chart,
    data: result.data,
    goalLineColors : ['red','green','blue'],
    xkey: 'Cook_Name',
    ykeys: ['Total_Orders'],
    labels: ['Total_Orders'],
    barColors: ['#dc3545'],
    gridTextColor : '#000',
    gridTextSize: '15px',
    resize : true        
  });

  if(result.data > 0){
    $('#kitchen_orders_heading').text('Today\'s Cook Orders'); 
  }
             
}).fail(function() {
  window.alert('Network Error! Try Again!');
});

    $("#tax-form").submit(function(e) {
      var tax = $("#tax").val();
      console.log("Tax is ", tax);

      var formData = {
          'tax': tax
      }

      $.ajax({
          type: "PUT",
          url: '/api/dashboard-manager/tax',
          dataType: 'json',
          data: formData,
          success:(json) => {
              jsonData = json.data;
              window.location.reload();
          }

      });
      e.preventDefault();
    });

    $("#points-form").submit(function(e) {
      var points = $("#points").val();
      console.log("points", points);

      var formData1 = {
        'points_per_order': points
      };

      $.ajax({
        type: "PUT",
        url: "/api/dashboard-manager/points",
        dataType: 'json',
        data: formData1,
        success:(json) => {
          jsonData = json.data;
          window.location.reload();
        }

      });
      e.preventDefault();

    });

    $("#points-limit-form").submit(function(e) {
      var limit = $("#limit").val();
      console.log("limit", limit);

      var formData2 = {
        'points_limits': limit
      };

      $.ajax({
        type: "PUT",
        url: "/api/dashboard-manager/limits",
        dataType: 'json',
        data: formData2,
        success:(json) => {
          jsonData = json.data;
          window.location.reload();
        }

      });
      e.preventDefault();

    });

    $("#discount-form").submit(function(e) {
      var discount = $("#discount").val();
      console.log("discount", discount);

      var formData3 = {
        'discount_percent': discount
      };

      $.ajax({
        type: "PUT",
        url: "/api/dashboard-manager/discount",
        dataType: 'json',
        data: formData3,
        success:(json) => {
          jsonData = json.data;
          window.location.reload();
        }

      });
      e.preventDefault();

    });



    
    



});
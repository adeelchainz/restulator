
$(document).ready(function(){
    getOrderCount();
    getTodayOrders();
    getPendingOrders();
    getServingOrders();

   
  
});

function getOrderCount(e) {

    $.ajax({
        type :'GET',
        url : '/api/dashboard/orderCount',
        dataType: 'json',
        success:(json) =>{
                jsonData = json.data;
                document.getElementById("total-orders").innerHTML = jsonData[0].total_orders;

        }

    });

}

function getTodayOrders(e) {
    $.ajax({
        type:'GET',
        url: '/api/dashboard/get/today/orders',
        dataType: 'json',
        success:(json) =>{
            jsonData = json.data;
            document.getElementById("orders-today").innerHTML = jsonData[0].orders_today;

    }
    });
}
function getPendingOrders(e) {
    $.ajax({
        type :'GET',
        url : '/api/dashboard/orders/pendingOrders',
        dataType: 'json',
        success:(json) =>{
                jsonData = json.data;
                document.getElementById("pending-orders").innerHTML = jsonData[0].pending_orders;

        }

    });
}

function getServingOrders(e) {
    $.ajax({
        type: 'GET',
        url: '/api/dashboard/orders/get/serving/orders',
        dataType: 'json',
        success:(json) => {
            jsonData = json.data;
            document.getElementById("serving-orders").innerHTML = jsonData[0].serving_orders;

        }
    })
}







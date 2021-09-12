        
        

$(document).ready(function(){


    $.ajax({
            type :'GET',
            url : '/api/itemCategories/',
            async:false,
            // dataType: 'json',
    }).done(function(data){

                    categories_obj = data.data;
                    console.log(categories_obj[0].id + " " +  categories_obj[0].name);
                    console.log(data.length);
                    var x ="",y="", i;

                    for (i=0; i<data.data.length; i++) {
                           x = x + "<li class=\"nav-item\" ><a class=\"nav-link\" data-toggle=\"tab\" id=\"" + 
                             data.data[i].name + "\" href=\"#" + data.data[i].name.toLowerCase().replace(" ","-")  + "\">" +  data.data[i].name +  "</a></li> \n";
 
                    }

                    for (i=0; i<data.data.length; i++) {
                            if(i==0){
                                y = y + '<div id="'+data.data[i].name.toLowerCase().replace(" ","-") + '" class="container tab-pane active"><br></div>';
                            }
                            else{
                                y = y + '<div id="'+data.data[i].name.toLowerCase().replace(" ","-")  + '" class="container tab-pane fade"><br></div>';
                            }
                        
                                     

                //     console.log(x)
                    document.getElementById("nav_items").innerHTML = x;
                    document.getElementById("tab_content").innerHTML = y;
                    



        }

        }).fail(function(){
                window.alert('Network Error!');
        });



    var item_count_by_categ_data=[];
        $.ajax({
            type: "GET",
            url: '/api/get_itemcount_by_category',
            async:false,
            dataType:'json',
            }).done(function(data){

                item_count_by_categ_data.push(data.data);
                });


        for(i=0;i<item_count_by_categ_data[0].length;i++){
                temp = document.getElementById(item_count_by_categ_data[0][i].name).textContent;
                document.getElementById(item_count_by_categ_data[0][i].name).innerHTML = temp + " <span class=\"badge badge-secondary\">" + item_count_by_categ_data[0][i].items_count + "</span>";

        }
        

        for(i=0;i<item_count_by_categ_data[0].length;i++){
               var obj_with_id = {
                        'id' : item_count_by_categ_data[0][i].id,

               }
               
               

               $.ajax({
                        type: "GET",
                        url: '/api/item/' + item_count_by_categ_data[0][i].id,
                        async:false
                        }).done(function(data){
                                x = "<div class=\"row\">";
                                for (j=0;j<data.data.length;j++){
                                        image_value = '';
                                        if (data.data[j].image == ''){
                                                image_value = 'uploads\\potato.jpg';
                                        }
                                        else{
                                                image_value = data.data[j].image;
                                        }

                                        x = x + "<div class=\"col-sm-6\"><div class=\"card card-accent-dark bg-light\" ><div class=\"card-body\"><div class=\"row\"><div class=\"col-sm-6\"><div class=\"row\"><div class=\"col-sm-6\"><img  src= \"/" + 
                                        image_value + 
                                        " \" alt=\"../uploads/potato.jpg\" width=\"150px\" height=\"150px\" class=\"rounded float-left\"></div><div class=\"w-100\"></div><div class=\"col\"></div></div></div><div class=\"col-sm-6\"><h4 class=\"card-title\">" + 
                                        data.data[j].name  + 
                                        "</h4><div class=\"row card-text\"><button class=\"btn btn-primary btn-lg\" id=\"" + data.data[j].id  + "\"  data-id=\""+ data.data[j].id  + 
                                        "\"   data-toggle=\"modal\" data-target=\"#myModal\"><i class=\"fa fa-bars\"></i> Details</button><div class=\"w-100\"> </div><button id=\"item " + data.data[j].id + " \" data-id= \" " + data.data[j].id+ " \" style=\"margin-top:0.5rem\" class=\"btn btn-danger btn-lg\" data-toggle=\"modal\" data-target=\"#itemDeleteModal\"><i class=\"far fa-trash-alt\"></i> Delete</button></div></div><div class=\"col-sm-2\"> </div></div></div></div></div>"   

                                }
                                x = x + "</div>";
                                console.log(x);
                                console.log("Appending to " + item_count_by_categ_data[0][i].name)
                                document.getElementById(item_count_by_categ_data[0][i].name.toLowerCase()).innerHTML = x;
                                
                                
                }).fail(function(){
                        window.alert('Network Error!');
                });

                


        }
        $("#itemDeleteModal").on('show.bs.modal', function (e) {
                var triggerLink = $(e.relatedTarget);
                var buttonID = triggerLink.data("id");
                console.log(buttonID);
                $(this).find(".modal-body").html('Are you sure you want to delete this? <button class="btn btn-success" type="button" data-dismiss="modal" onclick="Delete_item('+buttonID+')">Delete</button>');
                




        });        
        // console.log(data_from_req[0]);
        $("#myModal").on('show.bs.modal', function (e) {
                var triggerLink = $(e.relatedTarget);
                var buttonID = triggerLink.data("id");

                
                console.log("button id " + buttonID);
                $.ajax({
                        type: "GET",
                        url:'/api/itemFromSupply/' + buttonID,
                        // async: false,

                }).done(function(data){
                                if(data.data[0].supply_at != null){
                                        var date_formatted = new Date(data.data[0].supply_at);
                                        $("#modalTitle").text(data.data[0].name);
                                        var date_string =  date_formatted.getUTCDate() + "-"+ date_formatted.toLocaleString('default', { month: 'short' }) +"-" + date_formatted.getFullYear();
                                        // console.log(data[0].Quantity + " " + date_formatted.getDate() + "-"+ date_formatted.toLocaleString('default', { month: 'short' }) +"-" + date_formatted.getFullYear() );
                                        $('.modal-body').html("<label  class=\"col-sm-6\">Use in recipe: </label><label  class=\"col-sm-6\">"+ data.data[0].RecipeCount+ "</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Total Purse:</label><label  class=\"col-sm-6\"> " 
                                         + data.data[0].TotalPurse + " "+ data.data[0].Unit +
                                          "</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Total Cooked:</label><label  class=\"col-sm-6\">" + data.data[0].Total_Cooked +" " +data.data[0].Unit+  "</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Available:</label><label  class=\"col-sm-6\">" 
                                          + data.data[0].Quantity + 
                                          "KG</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Last Purses: </label><label  class=\"col-sm-6\"> "+ date_string + "</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Last Supplied by: </label><label  class=\"col-sm-6\"> "+ data.data[0].Supplier + "</label>");
                
        
        
                                }
                                else{
                                        $("#modalTitle").text(data.data[0].name);
                                        $('.modal-body').html("<h5>Supply does not Exist</h5>");
                                        // $('.modal-body').html("<label  class=\"col-sm-6\">Use in recipe: </label><label  class=\"col-sm-6\">0</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Total Purse:</label><label  class=\"col-sm-6\">0|KG </label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Total Cooked:</label><label  class=\"col-sm-6\">0 KGS </label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Available:</label><label  class=\"col-sm-6\">0 </label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Last Purses: </label><label  class=\"col-sm-6\"> </label>");

                                }
        
        

        
                }).fail(function(){
                        window.alert('Network Error!');
                });                                
                // var cover_small = triggerLink.data("cover_small");
                
                // $("#modalTitle").text(title);
                // $(this).find(".modal-body").html("<label  class=\"col-sm-6\">Use in recipe: </label><label  class=\"col-sm-6\">1</label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Total Purse:</label><label  class=\"col-sm-6\">25|KG </label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Total Cooked:</label><label  class=\"col-sm-6\">0 KGS </label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Available:</label><label  class=\"col-sm-6\">24.8 </label><div class=\"w-100\"></div><label  class=\"col-sm-6\">Last Purses: </label><label  class=\"col-sm-6\">30-Sep-2017</label><div class=\"w-100\"></div><label  class=\"col-sm-6 \">Added by: </label><label  class=\"col-sm-6\">Someone</label>");
        });


        


});
function Delete_item(buttonId){
        console.log("Item ID:" + buttonId);

                $.ajax({
                        url:"/api/item/" + buttonId,
                        method: "DELETE",                                        
                }).done(function(data){         
                        window.location.reload();
                }).fail(function(){
                        window.alert('Network Error!');
                });
                window.location.reload();                

};





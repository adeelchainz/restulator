
$(document).ready(function(){
        
        $("#alert-success").hide();
        $("#alert-danger").hide();
        $("#ingredient-success").hide();
        $("#category-success").hide();
        $("#modal-success").hide(); 
        $("#error-ingredients").hide();

        getDishType();
        getIngredientType();

        $("#ingType").change(function ingredient(e){
                $("#selectIng").children('option:gt(0)').hide();
                $('#selectIng').val("");

                var ingType  = $("#ingType").val();                         
                $.ajax({
                                type :'GET',
                                url : '/api/ingredients/' + ingType,
                                success:(json) =>{

                                        if(json.status) { 
                                                jsonData = json.data;
                                                var x ="", i;
                                                for (i=0; i<jsonData.length; i++) {
                                                        x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";
                                                }
                                                elem = document.getElementById("selectIng");
                                                $("#selectIng").children('option:gt(0)').hide();

                                                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                                for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.                                                         
                                                        var option = document.createElement('option'); // create the option element
                                                        option.value = jsonData[i].id; // set the value property
                                                        option.appendChild(document.createTextNode(jsonData[i].name)); // set the textContent in a safe way.
                                                        df.appendChild(option); // append the option to the document fragment
                                                }
                                                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                                                // var selectDishId  = jsonData[0].id;

                                        }
                                        else {
                                                $("#modal-title").html(`
                                                    Get Ingredients!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while getting the Ingredients. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                }
                        });
        });

        $('#addIngredientForm').validate({
                rules: {
                        ingType: "required",
                        selectIng: "required",
                        qty: {
                                required: true,
                                min: 1                                     
                        }
                    },
                    messages: {
                        ingType: "Please Select  Ingredient Type",     
                        selectIng: "Please select any Ingredient",
                        qty: {
                                required: "Please enter quantity",
                                min: "Quantity must be greater than 0"
                        }
                    }
                    
        });
                var i = [];
                var ingredients = [];  
                var formData = {};
                var ingredientsObject = {};

                       $("#addIng").click(function(e){
                           if($("#addIngredientForm").valid()){ 

                                formData = {
                                'item_id':$("#selectIng").val(),
                                'item_quantity': $("#qty").val()
                                };

                                // Object having item id as its name(key) and its quantity as value.

                                if (!ingredientsObject[formData['item_id']])
                                        ingredientsObject[formData['item_id']] = parseInt(formData['item_quantity']);

                                else ingredientsObject[formData['item_id']] += parseInt(formData['item_quantity']);

 
                        $('#selectIng').val("");
                        $("#qty").val("");
                        $("#ingType").val("");

                        $("#modal-success").show();

                        }
                        e.preventDefault();
                   });
                        
                       
               
               var inc=0;
               $('#addIng').click(function () {
                if($("#addIngredientForm").valid()){   
                       if (this.id == 'addIng') {
                               $("#ingredient-success").show();
                               inc=inc+1;
                               inc=parseInt(inc);
                               var divData=document.getElementById("ingredient-success");
                               divData.innerHTML="Ingredient Successfully Added! ("+inc +")";//this part has been edited

                                }
                        
                        }             
                });

$("#dishAddForm").submit(function(e){

        // converting ingredientsObj to array.
        var objToArr = []

        for(var i in ingredientsObject){
                objToArr.push([i, ingredientsObject[i]]);
        }

        if(objToArr.length > 0) {

                var formData1= {
                        'id' : '',
                        'name' : $("#dish-name").val(),                                
                        'description': $('#dish-description').val(),
                        'price': $('#dish-price').val(),
                        'dishType_id': $('#selectlist').val(),
                        'ingredients': objToArr

                }       
                        $.ajax({
                                type :'POST',
                                url : '/api/dish/',
                                data : {'data': formData1},
                                dataType: 'json',
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#alert-success").show();
                                                $("#ingredientsModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Dish!!
                                                `);
                                                $('#modal-body').html(`
                                                Dish successfully Added!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                        else {
                                                $("alert-danger").show();
                                                $("#ingredientsModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Dish!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Adding the Dish. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                }

                        });
                }
                else {
                        $("#error-ingredients").show();

                }
        e.preventDefault();
});

                $('#addCategoryForm').validate({
                        rules: {
                                category: "required"
                        }
                });
             
             $("#add-cat").click(function(e){
                if($("#addCategoryForm").valid()){
                var formData = {
                        'type': $("#category").val()
                };
                        $.ajax({
                                type :'POST',
                                url : '/api/dishType/',
                                data : formData,                             
                                dataType: 'json',
                                success:(json) =>{
                                        if(json.status) {
                                                $("#category").val("");
                                                getDishType();

                                                $("#myModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Category!!
                                                `);
                                                $('#modal-body').html(`
                                                Category successfully Added!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                        else {
                                                $("#myModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Category!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Adding the Category. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                }
                        });
                        e.preventDefault();
                        
                 $("#selectlist").empty();
                 $("#category-success").show();
                
                }
               
           });
});

        
function getIngredientType(e) {
        $.ajax({
                type :'GET',
                url : '/api/ingredients/type',
                success:(json) =>{
                        if(json.status) {
                                        
                                jsonData = json.data;
                                var x ="", i;
                
                                for (i=0; i<jsonData.length; i++) {
                                        x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].name + "</option>";
                        
                                }
                                elem = document.getElementById("ingType");
                                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                        var option = document.createElement('option'); // create the option element
                                        option.value = jsonData[i].id; // set the value property
                                        option.appendChild(document.createTextNode(jsonData[i].name)); // set the textContent in a safe way.
                                        df.appendChild(option); // append the option to the document fragment
                                }
                                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                        }

                        else {
                                $("#myModal").modal('hide');
                                $("#modal-title").html(`
                                        Get Ingredients Type!!
                                `);
                                $('#modal-body').html(`
                                Error while Getting the Ingredients. Please Try Again!
                                `);
                                $("#modal").modal('show'); 
                                
                        }

                }
        });
    }

    function getDishType(e) {
        $.ajax({
                type :'GET',
                url : '/api/dishType/',
                success:(json) =>{
                if(json.status) {
                        jsonData = json.data;
                        var x ="", i;
        
                        for (i=0; i<jsonData.length; i++) {
                            x = x + "<option value=" + jsonData[i].type_id + ">" + jsonData[i].type + "</option>";
              
                        }
                        elem = document.getElementById("selectlist");
                        df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                        for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                var option = document.createElement('option'); // create the option element
                                option.value = jsonData[i].type_id; // set the value property
                                option.appendChild(document.createTextNode(jsonData[i].type)); // set the textContent in a safe way.
                                df.appendChild(option); // append the option to the document fragment
                        }
                        elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                }
                else {
                        $("#myModal").modal('hide');
                        $("#modal-title").html(`
                                Get Dish Type!!
                        `);
                        $('#modal-body').html(`
                        Error while getting the Dish Types. Please Try Again!
                        `);
                        $("#modal").modal('show');

                }
                
                }
        });

    };
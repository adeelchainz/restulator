
$(document).ready(()=>{
        $("#alert-success").hide();
        $("#alert-danger").hide();

        $('#modal-alert-success').hide();    
        $('#modal-alert-danger').hide(); 


        getCategories();

                $("#CategAddModal").on('show.bs.modal', function (e) {
                        $(function () {
                                $('#AddCategForm').validate({
                                        rules:{
                                                categName: "required"  
                                        },
                                        messages:{
                                                categName :   "Please Provide Category Name"
                                        }
                                });
                        });

                   
                        
                        $("#categAddButton").click(function(e){
                                
                        
                                if($('#AddCategForm').valid()){

                                        $.ajax({
                                                type :'POST',
                                                url : '/api/itemCategories',
                                                data : {
                                                        "name": $('#categName').val()

                                                },                       
                                                
                                        }).done(function(result){
                                                if(result.data){
                                                        
                                                        console.log("Recieved some data", result.data);
                                                        // window.location.reload();
                                                        $('#selectlist').empty();
                                                        
                                                        $("#modal-alert-success").show(); 
                                                        getCategories();
                                                                                               
                                                        
                                                }
                                                else{
                                                        $("#modal-alert-danger").show();
                                                }
                                        }).fail(function() {
                                                window.alert('Network Error! Try Again!');
                                        });                                        



                                }
                                // else{
                                //         window.alert("Please Category to add!");
                                // }

                        });



                        
                });                        















        $("#itemAddForm").submit(function(e){
                
                var formData = new FormData();
                formData.append('id', '');
                formData.append('quantity',$("#itemQuantity").val()); 
                formData.append('unit',$('#itemUnit').val());                       
                formData.append('name',$("#itemName").val());
                formData.append('description', $('#itemDescrip').val());                        
                var files = $('#image')[0].files[0];
                formData.append('image',files)
                formData.append('category_id', $('#selectlist').val());

                console.log(formData);
                console.log("Data recieved: " +" Selected category id: "+ $("#selectlist").val() + " "  + "Image : "+ files + " Name: " +$("#itemName").val() + " description: " + $('#itemDescrip').val() + " Quantity: " + $('#itemQuantity').val() );
                $.ajax({
                        type :'POST',
                        url : '/api/item',
                        data : formData,
                        processData: false,
                        contentType: false,
                        cache: false,                        
                        
                }).done(function(result){
                        if(result.data){
                                
                                console.log("Recieved some data", result.data);
                                window.location.reload();
                                $("#alert-success").show();                                        
                                
                        }
                        else{
                                $("#alert-danger").show();
                        }
                }).fail(function() {
                        window.alert('Network Error! Try Again!');
                });
         
                e.preventDefault();
                // window.location.reload();


                
        });





    });
    function getCategories(){
        $.ajax({
                type :'GET',
                url : '/api/itemCategories/',
        }).done(function(data){
                if(data.data){
                        
                        categories_obj = data.data;

                        

                        console.log(categories_obj[0].id + " " +  categories_obj[0].name);
                        console.log(data.data.length);
                        var x ="", i;

                        for (i=0; i<data.data.length; i++) {
                                // console.log(categories_obj[i].id  + " " + categories_obj[i].name)
                                        // console.log(data[i].name);
                                x = x + "<option value=" + data.data[i].id + " data-tokens= " + data.data[i].id +">" + data.data[i].name + "</option>";
                                // console.log(x);



                                
                        }
                        elem = document.getElementById("selectlist")

                        df = document.createDocumentFragment();
                        for (var i = 0; i < data.data.length; i++) {
                                var option = document.createElement('option');
                                option.value = data.data[i].id; 
                                option.appendChild(document.createTextNode(data.data[i].name)); 
                                df.appendChild(option); 
                        }
                        elem.appendChild(df);                                         
                        
                }
                else{
                        window.alert('Network Error! Try Again!');
                }
        }).fail(function() {
                window.alert('Network Error! Try Again!');
        });
}
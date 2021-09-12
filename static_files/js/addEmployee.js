
        $(document).ready(function(){

        getEmployeeCategory();

        $("#itemAddForm").submit(function(e){
                var date = new Date($("#empCreate").val()); 
                
                var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];                      
                var formData = new FormData();
                formData.append('name', $("#empName").val());
                formData.append('category_id', $("#selectlist").val());
                formData.append('national_identity', $("#empCNIC").val());
                formData.append('address', $("#empAdd").val());
                formData.append('mobile', $("#empMobile").val());
                formData.append('telephone', $("#empTel").val());
                var files = $('#image')[0].files[0];
                formData.append('image',files);
                formData.append('created_at', conv_date);
                formData.append('gender', $("#empGender").val());
                formData.append('salary', $("#empSal").val());
                formData.append('join_date', $("#empJoining").val());
                formData.append('birth_date', $("#empBirthday").val());
                formData.append('branch_id', $("#empBranch").val());

                        $.ajax({
                                type :'POST',
                                url : '/api/employee/',
                                data : formData,
                                processData: false,
                                contentType: false,
                                cache: false,
                                dataType: 'json',
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#modal-title").html(`
                                                    Add Employee!!
                                                `);
                                                $('#modal-body').html(`
                                                Employee successfully Added!
                                            `);
                                            $("#modal").modal('show');

                                            $("#modal").on('hidden.bs.modal', function () {
                                                window.location.reload();
                                             });
                                        }

                                        else {
                                                $("#modal-title").html(`
                                                    Add Employee!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Adding the Employee. Please Try Again!
                                            `);
                                            $("#modal").modal('show');

                                            $("#modal").on('hidden.bs.modal', function () {
                                                window.location.reload();
                                             });
                                        }
                                }

                        });
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
                           'role': $("#category").val()
                   };
                           $.ajax({
                                   type :'POST',
                                   url : '/api/employeeCategory/',
                                   data : formData,                             
                                   dataType: 'json',
                                   success:(json) =>{
                                        getEmployeeCategory();

                                        if(json.status) {
                                                $("#myModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Employee Category!!
                                                `);
                                                $('#modal-body').html(`
                                                Employee Category successfully Added!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                        else {
                                                $("#myModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Add Employee Category!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Adding the Category. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                   }
                           });
                           
                    $("#selectlist").empty();
                }
                  
              }); 
        function getEmployeeCategory(e) {
                $.ajax({
                        type :'GET',
                        url : '/api/employee/getEmployeeCategory/',
                        success:(json) =>{

                        if(json.status) {
                                jsonData = json.data;
                                var x ="", i;
                
                                for (i=0; i<jsonData.length; i++) {
                                                                        
                                        x = x + "<option value=" + jsonData[i].id + ">" + jsonData[i].role + "</option>";
                                                        
                                }
                                                        
                                elem = document.getElementById("selectlist")
                        
                                df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                                for (var i = 0; i < jsonData.length; i++) { // loop, i like 42.
                                        var option = document.createElement('option'); // create the option element
                                        option.value = jsonData[i].id; // set the value property
                                        option.appendChild(document.createTextNode(jsonData[i].role)); // set the textContent in a safe way.
                                        df.appendChild(option); // append the option to the document fragment
                                }
                                elem.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)

                        }
                        else {
                                $("#modal-title").html(`
                                                    Add Employee!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Getting the Employee Category. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                        }
                    }
                });
                 }
         });

      
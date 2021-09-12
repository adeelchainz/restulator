                   $(document).ready(function() {

                        $("#modal").on('hidden.bs.modal', function () {
                                window.location.reload();
                        });
                               
                            var t =  $('#dataTable').DataTable( { 
                                 "columnDefs": [ {
                                        "searchable": true,
                                        "orderable": true,
                                        "targets": 0
                                        } ],
                                "order": [[ 1, 'asc' ]],  
                                "ajax": {         
                                        type :'GET',
                                        url : '/api/employee/getAllEmployee/',
                                        dataType: 'json',                                              
                                }, 
                                "columns": [
                                        
                          
                {"data": "name"},
                { "data":"image", "render": function ( data, type, row, meta ) {
                        return '<img width="150px" src="/'+data+'" />';}},
                { "data": "name","render": function ( data, type, row, meta ) {
                        return 'Name: ' +  row.name + "<br />" + 'Mobile: ' + row.mobile + "<br />" +
                        "Address: " + row.address + "<br />" + "Created At: " + new Date(row['created_at']) ;}},
                { "data":'role'},
                {"data":"id","render": function (data, type, row, meta ) {
                        return '<button type="button" id="'+ data +' "class="btn btn-primary badge-pill edit mt-2" data-toggle="modal"  data-id="'+row.id+'" data-name="'+row.name+'" data-role="'+row.role+'" data-mobile="'+row.mobile+'" data-address="'+row.address+'" data-created_at="'+row.created_at+'" data-national_identity="'+row.national_identity+'" data-gender="'+row.gender+'" data-telephone="'+row.telephone+'" data-salary="'+row.salary+'" data-join_date="'+row.join_date+'" data-birth_date="'+row.birth_date+'" data-branch_id="'+row.branch_id+'" data-category_id="'+row.cat_id+'" data-image="'+row.image+'" data-target="#myModal">Edit&nbsp<i class="fas fa-edit"></i></button>' +
                        '<button id="' + row.id + ' "class="btn btn-danger badge-pill delete mt-2" data-toggle="modal"  data-id="'+row.id+'"  data-target="#deleteModal" style="margin-left:3px";>Delete&nbsp<i class="far fa-trash-alt"></i></button>';
                  }
                }
            ],
            "columnDefs": [
                { "width": "18%", "targets": 4 }
              ]    
                });

                t.on( 'order.dt search.dt', function () {
                        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                        cell.innerHTML = i+1;
                        } );
                } ).draw();
        
                     $("#deleteModal").on('show.bs.modal', function (e) {
                        var triggerLink = $(e.relatedTarget); 
                        $("#del-employee").data('id', triggerLink.data("id")); 
                        
                     });
                        
                        $("#del-employee").click(function(e){
                        var emp_id = $(this).data('id');
                  
                        $.ajax({
                                url:"/api/employee/" + emp_id,
                                method: "DELETE",
                                success:(json) =>{
                                        jsonData = json.data;
                                        if(json.status) {
                                                $("#deleteModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Delete Employee!!
                                                `);
                                                $('#modal-body').html(`
                                                Employee successfully Deleted!
                                            `);
                                            $("#modal").modal('show');
                                        }

                                        else {
                                                $("#deleteModal").modal('hide');
                                                $("#modal-title").html(`
                                                    Delete Employee!!
                                                `);
                                                $('#modal-body').html(`
                                                Error while Deleting the Employee. Please Try Again!
                                            `);
                                            $("#modal").modal('show');
                                        }
                                }
                        });
                        e.preventDefault();
                    });

                $('#editEmptForm').validate({
                        rules: {
                                name: "required",
                                mobile: {
                                        required: true,
                                        minlength: 11,
                                        maxlength: 11
                                        
                                },
                                address: "required",
                                identity: {
                                        required: true,
                                        minlength: 13,
                                        maxlength: 13                                    
                                },
                                gender: "required",
                                salary: "required",
                                empCreate: "required",
                                join: "required",
                                branch: "required",
                                selectlist: "required"
 
                            },
                            messages: {
                                name: {
                                    required: "Please enter the name"
                                    
                                },      
                                address: "Please enter the address",
                                mobile: {
                                        required: "Please enter mobile"
                                }
                            }
                            
                });
                                
                $("#myModal").on('show.bs.modal', function (e) {

                var triggerLink = $(e.relatedTarget);
                var id = triggerLink.data("id");
                var name  = triggerLink.data("name");
                var role = triggerLink.data("role");
                var  mobile = triggerLink.data("mobile");
                var address = triggerLink.data("address");
                var national_identity = triggerLink.data("national_identity");
                var telephone = triggerLink.data("telephone");
                var gender = triggerLink.data("gender");
                var salary = triggerLink.data("salary");
                var created_at = triggerLink.data("created_at");
                var join_date = triggerLink.data("join_date");
                var birth_date = triggerLink.data("birth_date");
                var branch_id = triggerLink.data("branch_id");
                var cat_id = triggerLink.data("category_id");

                $("#name").val(name); 
                $("#mobile").val(mobile);
                $("#address").val(address);
                $("#role").val(role);
                $("#telephone").val(telephone);
                $("#gender").val(gender);
                $("#salary").val(salary);
                $("#created_at").val(created_at);
                $("#join_date").val(join_date);
                $("#birth_date").val(birth_date);
                $("#branch_id").val(branch_id);
                $("#national_identity").val(national_identity);
                $("#selectlist").val(cat_id);

                $("#editEmp").data('id', triggerLink.data("id"));
        });

                $("#editEmp").click(function(e){
                    if( $('#editEmptForm').valid()) {

                        var date = new Date($("#created_at").val());                
                        var conv_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-"+date.getDate()  +  ' '+ date.toTimeString().split(' ')[0];                      
                        var id = $(this).data('id');

                        var formData = new FormData();

                        formData.append('id', id);
                        formData.append('name', $("#name").val());
                        formData.append('address', $("#address").val());
                        formData.append('mobile', $("#mobile").val());
                        var files = $('#image')[0].files[0];
                        formData.append('image',files);
                        formData.append('national_identity', $("#national_identity").val());
                        formData.append('gender', $("#gender").val());
                        formData.append('salary', $("#salary").val());
                        formData.append('created_at', conv_date);
                        formData.append('join_date', $("#join_date").val());
                        formData.append('birth_date', $("#birth_date").val());
                        formData.append('branch_id', $("#branch_id").val());
                        formData.append('telephone', $("#telephone").val());
                        formData.append('category_id', $("#selectlist").val());


                                $.ajax({
                                        type :'PUT',
                                        url : '/api/employee/',
                                        data : formData,
                                        processData: false,
                                        contentType: false,
                                        cache: false,
                                        dataType: 'json',
                                        success:(json) =>{
                                                jsonData = json.data;
                                                if(json.status) {
                                                        $("#myModal").modal('hide');
                                                        $("#modal-title").html(`
                                                            Edit Employee!!
                                                        `);
                                                        $('#modal-body').html(`
                                                        Employee successfully Edited!
                                                    `);
                                                    $("#modal").modal('show');
                                                }
        
                                                else {
                                                        $("#myModal").modal('hide');
                                                        $("#modal-title").html(`
                                                            Edit Employee!!
                                                        `);
                                                        $('#modal-body').html(`
                                                        Error while Editing the Employee. Please Try Again!
                                                    `);
                                                    $("#modal").modal('show');
                                                }
                                        }
        

                                });
                        e.preventDefault();
                                }
                        });      

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
                                $("#myModal").modal('hide');
                                $("#modal-title").html(`
                                        Get Employee Category!!
                                `);
                                $('#modal-body').html(`
                                Error while getting the Employee Category. Please Try Again!
                                `);
                                $("#modal").modal('show');
        
                        }
                        
        
                    }
        
                });
            });

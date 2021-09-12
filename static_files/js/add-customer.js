$(document).ready(()=>{

    $("#modal").on('hidden.bs.modal', function () {
        window.location.reload();
    });


    $('#formCustomer').submit(function(e){

        $('#modal-title').html(`
            Add Customer Status
        `);

        var data = {
            name: $('#inputName').val()
        }
        if ($('#inputEmail').val()) data.email = $('#inputEmail').val();

        $.ajax({    
            url: '/api/customer/',
            type: 'POST',
            data: data
        }).done(function(result){
            if ($('#inputEmail').val()){

                $('#modal-body').html(`
                    An email has been sent to Email: <b><i>${$('#inputEmail').val()}</i></b> with security key
                `);
            }
            else {
                $('#modal-body').html(`
                Account successfully created!
            `);
            }
            $("#modal").modal('show');
        }).fail(function(result) {
            if(result.responseJSON.data.code){
                $('#modal-body').html(`
                Email: <b><i>${$('#inputEmail').val()}</i></b> already exist, try another one!
            `);
            
            }
            $("#modal").modal('show');
        });
    });



    // delete modal
    $('#confirm-delete').on('hidden.bs.modal',function(){
        $("#delete-body").html('Are you sure you want to delete customer named: ');
     });
    $("#confirm-delete").on('show.bs.modal',function(e){
        var triggerLink = $(e.relatedTarget);
        $("#delete-body").html($("#delete-body").html()  + "<strong>" +  triggerLink.data("name") + "<strong/> ?");
        $("#delete-btn").data('id', triggerLink.data("id"));
        $("#delete-btn").data('name', triggerLink.data("name"));
    });
    $("#delete-btn").click(function(e){
        $('#modal-title').html(`
            Delete Customer Status
        `);
        var id = $(this).data('id');
        var name = $(this).data('name');

        $.ajax({
            url: '/api/customer/',
            type: 'DELETE',
            data: {
                id: id
            }
        }).done(function(result){

            $('#modal-body').html(`
                Customer 
                <b><i>${name}</i></b> 
                deleted 
                successfully!
            `);

            
            $("#confirm-delete").modal('hide');
            $("#modal").modal('show');
        }).fail(function() {
            $('#modal-body').html(`
                Couldn't delete
                Customer
                <b><i>${name}</i></b>!
                Check your connection or try later!
            `);
            //window.location.reload();

            $("#confirm-delete").modal('hide');
            $("#modal").modal('show');
            
        });
        $("#confirm-delete").modal('hide');
    });



    // edit customer modal

    $("#myModal").on('show.bs.modal', function (e) {
        $('#modal-title').html(`
            Edit Customer Status
        `);

        var triggerLink = $(e.relatedTarget);

        $("#formNameEdit").val(triggerLink.data("name"));
        if (triggerLink.data("email") != "Not Provided")$("#formEmailEdit").val(triggerLink.data("email"));
    
        $(function () {
            $("#editSuppForm").validate({
                rules: {
                    formNameEdit: {
                        required: true
                    },
                    formEmailEdit: {
                        required: true,
                        type: "email"
                    }
                },
                messages: {
                    formNameEdit: {
                        required: "Please Provide Name"
                    },
                    formEmailEdit: {
                        required: "Please Provide Email",
                        type: "Must be a vliad email."
                    }
                }
            });
        });

    
        // form button click listener
        $("#editCust").click(function (e) {

            if ($("#editCustForm").valid()) {
                var editedData = {
                    id: triggerLink.data("id"),
                    name: $("#formNameEdit").val(),
                    email: $("#formEmailEdit").val()
                }
    
                updatedCol = {
                    id: editedData.id
                }
    
                Object.keys(editedData).forEach((key, index) => {
                    if (editedData[key] != triggerLink.data(key)) {
                        updatedCol[key] = editedData[key];
                    }
                });
    

                $.ajax({
                    url: '/api/customer/',
                    type: 'PUT',
                    data: updatedCol
                }).done(function (result) {

                    $('#modal-body').html(`
                        Customer <b><i>${triggerLink.data("name")}</i></b>
                        edited
                        successfully!
                    `);
                    $("#myModal").modal('hide');
                    $("#modal").modal('show');

                    //window.location.reload();

                }).fail(function (result) {
                    $('#modal-body').html(`
                        Couldn't edit
                        Customer
                        <b><i>${triggerLink.data("name")}</i></b>!
                        Check your connection or try later!
                    `);
                    $("#myModal").modal('hide');
                    $("#modal").modal('show');
                });
                
            }

        });
        $("#myModal").modal('hide');

    });



    // customers datatable 
    $("#dataTable").DataTable({
        ajax: {
            url: "/api/customer/",    
            type: "GET"
        },
        dataSrc: 'data', // the key e.g 'data' to get the data from, '' if its an array, for nested obj, use parent.child syntax.
        columns: [
            { 
                "render": function ( data, type, full, meta ) {
                    return  meta.row + 1;
                } 
            },
            {data: 'name'},
            {
                render: function (data, type, row) {
                    if (row.email != "Not Provided") return `<i>${row.email}</i>`;
                    else return row.email;
                }
            },
            {
                render: function (data, type, row) {
                    if (row.points >= 1000) return `<b><i>${row.points}</i></b>`;
                    else return row.points;
                }
            },
            {
                render: function (data, type, row) {

                    return '<button id="edit-cust-btn" class="btn btn-primary badge-pill edit" data-toggle="modal" data-target="#myModal"' +
                    
                    ' data-id="' + row.id + '" data-name="' + row.name + '" data-email="' + row.email + '" style="margin-right:15px">Edit&nbsp<i class="fas fa-edit"></i></button>' + 

                    '<button id="delete-cust-btn" class="btn btn-danger badge-pill delete" data-toggle="modal"' + 
                    
                    'data-target="#confirm-delete" data-id="'+row.id+'" data-name="' + row.name + '">Delete&nbsp<i class="far fa-trash-alt"></i></button>'

                }
            }
        ],
        "columnDefs": [
            { "width": "18%", "targets": 4 }
          ]
    });
});
$(document).ready(()=>{
    
    $("#modal").on('hidden.bs.modal', function () {
        window.location.reload();
    });

    $('#formSupplier').submit(function(e){
        $('#modal-title').html(`
            Add Supplier Status
        `);
        $.ajax({    
            url: '/api/supplier/',
            type: 'POST',
            data: {
                name: $('#inputSupplierName').val(),
                national_identity: $('#inputSupplierCnic').val().replace(/-/g,""),
                address: $('#inputSupplierAddress').val(),
                mobile: $('#inputSupplierMobile').val().replace(/-/g,""),
                telephone: $('#inputSupplierTelephone').val().replace(/-/g,"")

            }
        }).done(function(result){
            $('#modal-body').html(`
                Supplier ${$('#inputSupplierName').val()} successfully Added!
            `);
            
            $("#modal").modal('show');
        }).fail(function() {
            $('#modal-body').html(`
                Error Adding Supplier, Check your connection and try again!
            `);
            $("#modal").modal('show');
        });
    });

    $("#suppliesModal").on('hidden.bs.modal',function(e){
        
        //$("#suppliesTable").dataTable().fnDestroy();
        $("#suppliesTable").DataTable().clear().destroy();
    });

    $("#suppliesModal").on('show.bs.modal',function(e){
        var id = $(e.relatedTarget).data("id");
        var s = $("#suppliesTable").DataTable({
            dom: 'Bfrtip',
            buttons: [
            'copy', 'csv', 'excel', 'pdf','print'
            ],             
            "pageLength": 5,
            ajax: {
                url: "/api/supply/",
                type: "POST",
                data:{
                    id: id
                }
            },
            dataSrc: 'data',
            columns: [
                {data: 'id'},
                {data: 'supplier_name'},
                {
                    // parsing ISO-8601 date representation

                    render: function (data, type, row) {

                        MM = ["January", "February","March","April","May","June","July","August","September","October","November", "December"]

                        xx = row.supply_at.replace(
                            /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\w{1})/,
                            function($0,$1,$2,$3,$4,$5,$6){
                                return MM[$2-1]+" "+$3+", "+$1+" at "+$4%12+":"+$5+(+$4>12?" PM":" AM") // AM PM can be removed if 24-hour format is used.
                            }
                        )
                        return xx;
                        
                    }
                },
                {data: 'bill'},
                {data: 'payment'},
                {data: 'payment_status'}
            ]
        });
        s.columns.adjust();
        s.on( 'order.dt search.dt', function () {
            s.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
            } );
        }).draw();
    });

    $('#confirm-delete').on('hidden.bs.modal',function(){
        $("#delete-body").html('Are you sure you want to delete supplier named: ');
     });

    $("#confirm-delete").on('show.bs.modal',function(e){
        var triggerLink = $(e.relatedTarget);
        $("#delete-body").html($("#delete-body").html()  + "<strong>" +  triggerLink.data("name") + "<strong/> ?");
        $("#delete-btn").data('id', triggerLink.data("id"));
        $("#delete-btn").data('name', triggerLink.data("name"));
    });
    $("#delete-btn").click(function(e){
        $('#modal-title').html(`
            Delete Supplier Status
        `);
        var id = $(this).data('id');
        var name = $(this).data('name');
        $.ajax({
            url: '/api/supplier/',
            type: 'DELETE',
            data: {
                id: id
            }
        }).done(function(result){
            $('#modal-body').html(`
                Supplier
                <b><i>${name}</i></b> 
                deleted 
                successfully!
            `);$("#confirm-delete").modal('hide');
            $("#modal").modal('show');
        }).fail(function() {
            $('#modal-body').html(`
                Couldn't delete
                Supplier
                <b><i>${name}</i></b>!
                Check your connection or try later!
            `);$("#confirm-delete").modal('hide');
            $("#modal").modal('show');
        });
        $("#confirm-delete").modal('hide');
    });

    

    $("#myModal").on('show.bs.modal',function(e){

        var triggerLink = $(e.relatedTarget);
        $("#formNameEdit").val(triggerLink.data("name")),
        $("#formNicEdit").val(triggerLink.data("national_identity")),
        $("#formAddressEdit").val(triggerLink.data("address")),
        $("#formTelephoneEdit").val(triggerLink.data("telephone")),
        $("#formMobileEdit").val(triggerLink.data("mobile"))

        $(function () { 
        $("#editSuppForm").validate({
            rules: {
                formNameEdit: "required",
                formNicEdit: {
                    required: true,
                    minlength: 13,
                    maxlength: 15,
                },
                formAddressEdit:{
                    required: true
                },
                formTelephoneEdit: {
                    required: true,
                    minlength: 7,
                    maxlength: 11
                },
                formMobileEdit: {
                    required: true,
                    minlength: 11,
                    maxlength: 11
                }
            },
            messages: {
                formNameEdit: "Please Provide Name",
                formNicEdit: {
                    required: "Please Provide NIC",
                    minlength: "Must have length atleast 13 characters.",
                    maxlength: "Must be equal to 15 characters."
                },
                formAddressEdit:{
                    required: "Please Provide Address"
                },
                formTelephoneEdit: {
                    required: "Please Provide Telephone Number",
                    minlength: "Must be at least 7 characters",
                    maxlength: "Must be at most 11 characters"
                },
                formMobileEdit: {
                    required: "Please provide Mobile Number",
                    minlength: "Must be at least 11 characters",
                    maxlength: "Must be at most 11 characters"
                }
            }
        });
    }
        );

        $("#editEmp").click(function(e){
            $('#modal-title').html(`
        Edit Supplier Status
    `);
            if ($("#editSuppForm").valid()){
            var editedData = {
                id: triggerLink.data("id"),
                name : $("#formNameEdit").val(),
                national_identity : $("#formNicEdit").val(),
                address : $("#formAddressEdit").val(),
                telephone : $("#formTelephoneEdit").val(),
                mobile : $("#formMobileEdit").val()
            }

            updatedCol = {
                id: editedData.id
            }

            Object.keys(editedData).forEach((key, index) => {
                if(editedData[key] != triggerLink.data(key)){
                    updatedCol[key] = editedData[key];
                }
            });

            $.ajax({
                url: '/api/supplier/',
                type: 'PUT',
                data: updatedCol
            }).done(function(result){
                $('#modal-body').html(`
                        Supplier <b><i>${triggerLink.data("name")}</i></b>
                        edited
                        successfully!
                    `);
                    $("#myModal").modal('hide');
                    $("#modal").modal('show');
            }).fail(function(result) {
                $('#modal-body').html(`
                        Couldn't edit
                        Supplier
                        <b><i>${triggerLink.data("name")}</i></b>!
                        Check your connection or try later!
                    `);
                    $("#myModal").modal('hide');
                    $("#modal").modal('show');
            });
        }
        }); 
    });


    var t = $("#dataTable").DataTable({
        ajax: {
            url: "/api/supplier/",     
            type: "GET"
        },
        dataSrc: 'data', // the key e.g 'data' to get the data from, '' if its an array, for nested obj, use parent.child syntax.
        columns: [
            {data: 'id'},
            {data: 'name'},
            {data: 'national_identity'},
            {data: 'mobile'},
            {data: 'telephone'},
            {data: 'address'},
            {
                render: function (data, type, row) {

                    return '<button id="edit-supp-btn" class="btn btn-primary badge-pill edit" data-toggle="modal" data-target="#myModal"' +
                    
                    ' data-id="'+row.id+'" data-name="'+row.name+'" data-national_identity="'+row.national_identity+'" data-address="'+
                    
                    row.address + '" data-mobile="'+row.mobile+'" data-telephone="'+row.telephone+'" style="margin-left:15px"><i class="fas fa-edit"></i></button>' + 

                    '<button id="delete-supp-btn" class="btn btn-danger badge-pill delete" data-toggle="modal"' + 
                    
                    'data-target="#confirm-delete" data-id="'+row.id+'" data-name="'+row.name+'"style="margin-left:15px"><i class="far fa-trash-alt"></i></button>'

                }
            },
            {
                render: function (data, type, row) {

                    return '<button id="supplies-btn" class="btn btn-success badge-pill" data-toggle="modal"' + 
                    
                    'data-target="#suppliesModal" data-id="' + row.id + '">Supplies</button>'

                }
            }
        ]
    });
    t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
        cell.innerHTML = i+1;
        } );
    }).draw();


});

const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});



// ajax request for login.


$(document).ready(()=>{

    
    $('#form').submit(function(e){
        e.preventDefault();
        var self = this;
        $.ajax({
            url: '/api/customer/login',
            type: 'POST',
            data: {
                email: $('#username').val(),
                password: $('#password').val()
            }
        }).done(function(result){
            console.log(result);
            if (result.data){
                console.log("Customer Token information: " + result.token);
                // window.localStorage.clear();
                // window.localStorage.setItem('token', result.token);

                self.submit();
            }
            else $('#error').text(result.message);
        }).fail(function() {
            window.alert('Network Error!');
        });
    });
});

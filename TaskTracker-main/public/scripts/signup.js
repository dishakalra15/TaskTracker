// $.get(`/users/${id}/teamtasks?start=${start}&end=${end}`, function (data, status){

// });
// $(document).ready(function () {
    function validate(){
        try {
        var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var email = document.getElementById("email").value;
        var manager_email = document.getElementById("memail").value;
        var pass = document.getElementById("pass").value;
        var cpass = document.getElementById("cpass").value;
        var letters = /^[A-Za-z]+$/;
        if(fname.match(letters) && lname.match(letters))
        {
            if(fname.length>45 || lname.length>45){
                alert("Name too long");
            }else{
                if(pass.length > 45){
                    alert("Password too long");
                }else{
                    if(pass == cpass){
                        let url = '/users/signup';
                        let data = {
                            first_name:fname,
                            last_name:lname,
                            email:email,
                            manager_email: manager_email,
                            password: pass
                        }
                        $.ajax({
                            url: url,
                            data: JSON.stringify(data),
                            type: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            async: false,
                            success: function (response) {
                                if(!response.valid){
                                    alert("User is already registered, please sign in");
                                }else{
                                    alert("User created");
                                    var url = `/users/signin`;
                                    window.location.href = url;
                                }
                            },
                            error: function (result) {
                                alert("Something went wrong, Try Again");
                            }
                        });
                    }else{
                        alert("Passwords dont match");
                    }
                }
            }
        }
        else
        {
            alert("Name should only contain alphabets");
        }
        
        // $.post(url, data ,function(response, status) {
        //     console.log(response);
        //     if(!response.valid){
        //         alert("Invalid Credentials !!!");
        //     }else{
        //         var id = response.id;
        //         if(response.manager){
        //             var url = `/users/${id}`;
        //             console.log("URL: "+url);
        //             window.location.assign(url);
        //         }else{
        //             var url = `localhost:5000/users/${id}/tasks`
        //             window.location.href = url;
        //         }
        //     }
        //     // console.log(data.validation);
        //     // if(!data.validation){
        //     //     alert("Invalid Credentials");
        //     // }
        // });   
        } catch (error) {
            console.log("err: "+error);
        }
    }
    // })
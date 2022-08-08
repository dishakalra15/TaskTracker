// $.get(`/users/${id}/teamtasks?start=${start}&end=${end}`, function (data, status){

// });
// $(document).ready(function () {
function validate(){
    try {
    var username = document.getElementById("form2Example11").value;
    var pass = document.getElementById("form2Example22").value;
    var url = "/users/signin";
    let data = {
        username: username,
        pass: pass
    };
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
                alert("Invalid Credentials !!!");
            }else{
                var id = response.id;
                if(response.manager){
                    var url = `/users/${id}`;
                    console.log("URL: "+url);
                    window.location.href = url;
                }else{
                    var url = `/users/${id}/tasks`;
                    window.location.href = url;
                }
            }
        },
        error: function (result) {
            alert("Something went wrong, Try Again");
        }
    });
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
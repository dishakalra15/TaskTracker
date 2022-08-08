
var div = document.getElementById("cuttext");
div.innerText = div.innerText.substring(0, 10);
var url = window.location.pathname;
var arr = url.substring(1).split("/");
id = parseInt(arr[1]);
tid = parseInt(arr[3]);
function editit()
{
    var desc = document.getElementById("contente").value;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(desc.length == 0){
        alert("Tasks cannot be empty !");
    }
    else if(desc.length > 500){
        alert("Tasks length too long !");
    }
    else if(format.test(desc)){
        alert("Tasks cannot have special characters !")
        return;
    }else{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var data = {
        description: desc
    }
    var url = `/users/${id}/tasks/${tid}`;
    $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        async: false,
        success: function (response) {
            console.log("Done till now...");
            let go = `/users/${id}/tasks`;
            window.location.href = go;
            // if(!response.valid){
            //     alert("Invalid Credentials !!!");
            // }else{
            //     var id = response.id;
            //     if(response.manager){
            //         var url = `/users/${id}`;
            //         console.log("URL: "+url);
            //         window.location.href = url;
            //     }else{
            //         var url = `/users/${id}/tasks`;
            //         window.location.href = url;
            //     }
            // }
        },
        error: function (result) {
            alert("Something went wrong, Try Again");
        }
    });}
}

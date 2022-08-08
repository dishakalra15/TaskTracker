console.log("Scripts opened");

// d.textContent = today;



var url = window.location.pathname;
var arr = url.substring(1).split("/");
id = parseInt(arr[1]);
$.get(`/tasks/${id}`, function (data, status){
    
    console.log(data);
    // console.log(data['name']);
    let tdiv = document.createElement('div'),ddiv = document.createElement('div');
    tdiv.innerHTML = `<h2 class=" mb-3 h2">
    Hello! ${data['name']}, 
    
</h2>
    <h4>
    A Quote for you : ${data['quote']}
    </h4>`
//     ddiv.innerHTML = `<form id="new-task-form" class="form-group" method="post" action="/users/${data['id']}/tasks">
//     <textarea name="description" id="content" rows="3" class="form-control" placeholder="What did I do today ?" ></textarea>
//     <textarea id="current" name="dt" hidden ></textarea>
//     <input type="submit" value="Add task" name="taskno" id="add"  />
// </form>`
 
    for(let i=0;i<data['rows'].length;i++){
        var div=document.getElementById("cuttext");
        // var desc = document.getElementById("contenti");
        // var text = data['rows'].task_date.toString();
        // div.innerText = text.substring(0,10);
        // desc.innerText = data['rows'][i].description;  
        console.log(data['rows'][i].description); 
        
        var today = new Date(data['rows'][i].task_date);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        console.log(today);
    var cardDiv = document.createElement('div');
    cardDiv.innerHTML = `
    <div class="color">
    <div class="row task-item task-content">
    <div id="cuttext"  class="col-6 col-md-4"> ${new Date(data['rows'][i].task_date).toString().substring(0,10)}  </div>
    <div class="col-12 col-md-8 ">
        <textarea readonly name="content" id="contenti" rows="3" class="form-control">${data['rows'][i].description}
        </textarea>
    </div>
        <form method = "GET" action = "/users/${id}/tasks/${data['rows'][i].id}">
        <div class="actions">
            <button class="edit button" type="submit"  id = "ed">Edit</button>
        </div>
        </form>                            
</div>
</div>
`
    document.getElementById('cards').appendChild(cardDiv);
    }
    
    document.getElementById("greet").append(tdiv);
    // document.getElementById("do").append(ddiv);
    // data.array.forEach(element => {
    //     console.log(element);
    //     var div=document.getElementById("cuttext");
    //     var desc = document.getElementById("contenti");
    //     var text = element.rows.task_date.toString();
    //     div.innerText = text.substring(0,10);
    //     desc.innerText = rows.description;        
    // });

});

function saveit(){
    var desc = document.getElementById("content").value;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var today = new Date();
    if(desc.length == 0){
        alert("Tasks cannot be empty !");
    }
    else if(desc.length > 500){
        alert("Tasks length too long !");
    }
    else if(false){
        alert("Tasks cannot have special characters !")
        return;
    }else if(today.getDay() == 0 || today.getDay() == 6){
        alert("Weekend today !");
    }else{

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var data = {
        description: desc,
        dt: today
    }
    var url = `/users/${id}/tasks`;
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
            window.location.href = url;
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


// div.innerHTML='<p><span style="color:red; font-size:20px; font-family:Arial">Here is the real text that I want to strip to 100 characters</span></p><p>Can be splited <b>between</b> multiple divs. Here is some more text to be longer <p>';
// var excerpt=div.innerText.substring(0,10);
// console.log(excerpt)


// // $(document).ready(function(){
//     $("#new-task-form").on("submit",function(event){
//         event.preventDefault();
//         let v = document.getElementById('content');
//         console.log(v.value);
//         let postObj = {
//             date: new Date(),
//             description: v.value
//         }
//         $.ajax({
//             type: 'POST',
//             url: `/users/${10}/tasks`,
//             data: JSON.stringify(postObj),
//             contentType: "application/json",
//             success: function(resultData) {
//                 // console.log(text(resultData));
//             }
//       });
//     //   setTimeout(function() {
//         //   window.location.reload();
//     //  },0);
//         // console.log($("content").value);
//     })
// // })
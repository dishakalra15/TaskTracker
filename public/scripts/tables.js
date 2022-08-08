console.log("Tables")
$(document).ready(function () {
    function startIt() {
        console.log("Reloaded")
        i = 0;
        var url = window.location.pathname;
        var arr = url.substring(1).split("/");
        id = parseInt(arr[1]);
        var start = '2022-07-11';
        var end = '2022-07-13';
        today = new Date();
        var sub = today.getDay() - 1;
        today.setDate(today.getDate() - sub);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        console.log(today);
        limitDate = new Date();
        limitDate.setDate(limitDate.getDate()-sub);
        getIt(today, id);
    }
    function getIt(today, id) {
        $("#next").addClass('disabled');
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var start = yyyy + '-' + mm + '-' + dd;
        var temp = today;
        temp.setDate(temp.getDate() + 4);
        var dd = String(temp.getDate()).padStart(2, '0');
        var mm = String(temp.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = temp.getFullYear();
        var end = yyyy + '-' + mm + '-' + dd;
        today.setDate(today.getDate() - 4);
        // end = "';select * from users u join task t ON (u.id = t.user_id) \"";
        // end = end + '";select * from users u join task t ON (u.id = t.user_id) WHERE u.first_name like \"%';
        console.log("Updated part: "+start + " " + end + " " + today);
        $.get(`/users/${id}/teamtasks?start=${start}&end=${end}`, function (data, status) {
            console.log("ROWS: "+data);
            var amap = {};
            var emap = {};
            data.forEach(element => {
                amap[[element.first_name,element.email]] = amap[[element.first_name,element.email]] || [];
                var des = element.description;
                console.log(des);
                if(amap[[element.first_name,element.email]].length === 0){
                    var current_date = element.task_date;  
                    var obj = new Date(current_date).getDay()-1;
                    if(obj<0){
                        obj = 6;
                    }
                    for(let i=0;i<obj;i++){
                        amap[[element.first_name,element.email]].push(" ");
                    }
                    console.log(obj);
                }
                amap[[element.first_name,element.email]].push(des);
            });
            data.forEach(element => {
                var leftSize = 5-amap[[element.first_name,element.email]].length;
                for(let i=0;i<leftSize;i++){
                    amap[[element.first_name,element.email]].push(" ");
                }
            });
            console.log("amap is: " + amap);
            var tr;
            var c = 1;
            for(const [key, value] of Object.entries(amap)){
                var splitKey = key.split(",");
                var ht = '<div title='+splitKey[1]+'>'+splitKey[0]+'</div>';
                // console.log("Name and em: "+key[0]+" "+key[1]+" "+key);
                tr = $('<tr/>')
                tr.append("<th>" + c + "</th>");
                tr.append("<td>" + ht + "</td>");
                var left = 5;
                value.forEach(ele => {
                    left--;
                    tr.append("<td>" + '<textarea readonly name="mon" id="" cols="30" rows="10">' + ele + '</textarea>' + "</td>");
                    $('table').append(tr);                    
                });
                c++;
            }

        });
    }
    $("#next").click(function () {
        $("#prev").removeClass('disabled');
        today.setDate(today.getDate() + 7);
        console.log(today);
        // getIt(today);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var start = yyyy + '-' + mm + '-' + dd;
        var temp = today;
        console.log("Limit: "+limitDate +" today is: "+today);
        var lday = limitDate.getDate();
        var tday = today.getDate();
        console.log(lday +" tday "+tday);
        if((lday === tday) && (limitDate.getFullYear() === today.getFullYear()) && (limitDate.getMonth() === today.getMonth())){
            console.log("Disabling")
            $("#next").addClass('disabled');
        }
        temp.setDate(temp.getDate() + 4);
        var dd = String(temp.getDate()).padStart(2, '0');
        var mm = String(temp.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = temp.getFullYear();
        var end = yyyy + '-' + mm + '-' + dd;
        today.setDate(today.getDate() - 4);
        console.log(start + " " + end + " " + today);
        $.get(`/users/${id}/teamtasks?start=${start}&end=${end}`, function (data, status) {
            // alert("Data: " + data + "\nStatus: " + status);
            // $("#table_of_items tr").remove(); 
            var amap = {};
            data.forEach(element => {
                amap[[element.first_name,element.email]] = amap[[element.first_name,element.email]] || [];
                var des = element.description;
                console.log(des);
                if(amap[[element.first_name,element.email]].length === 0){
                    var current_date = element.task_date;
                    var obj = new Date(current_date).getDay()-1;
                    if(obj<0){
                        obj = 6;
                    }
                    for(let i=0;i<obj;i++){
                        amap[[element.first_name,element.email]].push(" ");
                    }
                    console.log(obj);
                }
                amap[[element.first_name,element.email]].push(des);
            });
            data.forEach(element => {
                var leftSize = 5-amap[[element.first_name,element.email]].length;
                for(let i=0;i<leftSize;i++){
                    amap[[element.first_name,element.email]].push("");
                }
            });
            var tr;
            var c = 1;
            var left = 5;
            $("#del").find("tr:not(:first)").remove();
            for(const [key, value] of Object.entries(amap)){
                var splitKey = key.split(",");
                var ht = '<div title='+splitKey[1]+'>'+splitKey[0]+'</div>';
                // console.log("Name and em: "+key[0]+" "+key[1]+" "+key);
                tr = $('<tr/>')
                tr.append("<th>" + c + "</th>");
                tr.append("<td>" + ht + "</td>");
                var left = 5;
                value.forEach(ele => {
                    left--;
                    tr.append("<td>" + '<textarea readonly name="mon" id="" cols="25" rows="10">' + ele + '</textarea>' + "</td>");
                    $('table').append(tr);                    
                });
                c++;
            }
        });
    });

    $("#prev").click(function () {
        $("#next").removeClass('disabled');
        today.setDate(today.getDate() - 7);
        console.log(today);
        // getIt(today);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var start = yyyy + '-' + mm + '-' + dd;
        var temp = today;
        temp.setDate(temp.getDate() + 4);
        var dd = String(temp.getDate()).padStart(2, '0');
        var mm = String(temp.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = temp.getFullYear();
        var end = yyyy + '-' + mm + '-' + dd;
        today.setDate(today.getDate() - 4);
        console.log(start + " " + end + " " + today);
        $.get(`/users/${id}/teamtasks?start=${start}&end=${end}`, function (data, status) {
            var amap = {};
            data.forEach(element => {
                amap[[element.first_name,element.email]] = amap[[element.first_name,element.email]] || [];
                var des = element.description;
                console.log(des);
                if(amap[[element.first_name,element.email]].length === 0){
                    var current_date = element.task_date;
                    var obj = new Date(current_date).getDay()-1;
                    if(obj<0){
                        obj = 6;
                    }
                    for(let i=0;i<obj;i++){
                        amap[[element.first_name,element.email]].push(" ");
                    }
                    console.log(obj);
                }
                amap[[element.first_name,element.email]].push(des);
            });
            data.forEach(element => {
                var leftSize = 5-amap[[element.first_name,element.email]].length;
                for(let i=0;i<leftSize;i++){
                    amap[[element.first_name,element.email]].push("");
                }
            });
            var tr;
            var c = 1;
            var left = 5;
            $("#del").find("tr:not(:first)").remove();
            for(const [key, value] of Object.entries(amap)){
                var splitKey = key.split(",");
                var ht = '<div title='+splitKey[1]+'>'+splitKey[0]+'</div>';
                // console.log("Name and em: "+key[0]+" "+key[1]+" "+key);
                tr = $('<tr/>')
                tr.append("<th>" + c + "</th>");
                tr.append("<td>" + ht + "</td>");
                var left = 5;
                value.forEach(ele => {
                    left--;
                    tr.append("<td>" + '<textarea readonly name="mon" id="" cols="25" rows="10">' + ele + '</textarea>' + "</td>");
                    $('table').append(tr);                    
                });
                c++;
            }
        });
        var backDate = new Date();
        backDate.setDate(today.getDate()-3);
        var dd = String(backDate.getDate()).padStart(2, '0');
        var mm = String(backDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = backDate.getFullYear();
        var end = yyyy + '-' + mm + '-' + dd;
        $.get(`/users/${id}/teamtasks?start=${end}&end=${end}`,function(data,status){
            if(data.length == 0){
                $("#prev").addClass('disabled');
            }
        });
    });
    startIt();
})

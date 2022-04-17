var get_start = (function () {
    var allComments = document.querySelector("#allComments");
    var path = window.location.pathname;
    var file = path.split("/").pop();
    var chaptNum = file.split(".").shift();

    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyBQr6zrt6rQoN1qYSm3uzfuJg_bITUy2ko",
        authDomain: "yellowuncle13-f1772.firebaseapp.com",
        databaseURL: "https://yellowuncle13-f1772-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "yellowuncle13-f1772",
        storageBucket: "yellowuncle13-f1772.appspot.com",
        messagingSenderId: "767025604235",
        appId: "1:767025604235:web:6cf57f56273bdb91c7568e"
    };
    firebase.initializeApp(firebaseConfig);
    var db = firebase.database();

    // Click button update db
    $('input:button').click(function(){
        var name = $('#add-name').val(),
            content = $('#add-content').val();
            if (name != "" && content != "") {
                db.ref(`/accounts/${name}/password`).on('value', function (snapshot) {
                    if (snapshot.exists()){
                        var value = prompt("請輸入密碼：");
                        if (value != snapshot.val()) {
                            alert(`不是${name}嗎？\n或是這個名稱已經被綁定囉，換一個吧！`);
                            return false;
                        }
                    }
                    db.ref(`/comments/overall/${chaptNum}`).push({
                        name : name,
                        content: content,
                        status: "",
                        type: "",
                        upvote: 0,
                        downvote: 0,
                        time: _DateTimezone(8)
                    });
                });
            }
        $('#myForm')[0].reset();
    });



    // get and display data
    function _getData() {
        db.ref(`/comments/overall/${chaptNum}`).on('value', function (snapshot) {
            var data = snapshot.val();
            if (data) {
                var names = [];
                var contents = [];
                var times = [];
                var len = 0;

                for (let key in data) {
                    names.push(data[key].name);
                    contents.push(data[key].content);
                    times.push(data[key].time);
                    len ++;
                }
                _createPageStr(len, names, contents, times);
            }
            else {
                db.ref(`/cmtCnt/${chaptNum}`).set(0);
                cmtCnt.innerHTML = 0;
            }
        });
    }

    // update to page
    function _createPageStr(len, names, contents, times) {
        var str = `<div class="container" style="text-align: left;">`;
        var i = 0;
        var style = "";
        for (i = len-1; i >= 0; i--) {
            if (`${names[i]}` == `yellowuncle` || `${names[i]}` == `小黃叔`) {
                style = `badge bg-dark text-wrap`;
            }
            str += `
                <div class="card border border-dark">
                    <div class="card-body">
                        <h5 class="card-title fs-5 fw-bold ${style}">${names[i]}</h5>
                        <h6 class="card-text fs-5" style="position: absolute; top: 3px; right: 5px; text-align:right;">#${i+1}</h6>
                        <h6 class="card-text text-muted" style="position: absolute; top: 30px; right: 5px; text-align:right; font-size: 10px;">${times[i]}</h6>
                        <hr class="dropdown-divider">
                        <p class="card-text fs-6 fw-bold">${contents[i]}</p>
                    </div>
                </div>
                `;
            style = ""
        }
        str += `</div>`
        allComments.innerHTML = str;
        db.ref(`/cmtCnt/${chaptNum}`).set(len);
        cmtCnt.innerHTML = len;
    }

    // time
    function _DateTimezone(offset) {
        d = new Date();
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * offset)).toLocaleString();
    }

    function init() {
        _getData();
    }

    return {
        init
    }

})();
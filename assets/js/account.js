var get_start = (function () {
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
        var name = $('#floatingInput').val(),
            addPsd = $('#floatingPassword').val();
        if (name != "" && addPsd != "") {
            var accounts = [];
            db.ref(`/accounts`).on('value', function (snapshot) {
                snapshot.forEach(child => {
                    accounts.push(child.key);
                });
            });
            var check = accounts.includes(`${name}`);
            if (check){
                alert(`${name}已經被綁定囉，換一個吧！`);
            }
            else {
                db.ref(`/accounts/${name}/password`).set(addPsd);
                db.ref(`/accounts/${name}/status`).set(0);
                db.ref(`/accounts/${name}/road`).set("未入道");
                alert(`${name}綁定成功，別忘記密碼囉！`);
            }
        }
        $('#applyForm')[0].reset();
    });



    // get and display data
    function _getData() {
        db.ref(`/accounts`).on('value', function (snapshot) {
            var accounts = [];
            snapshot.forEach(child => {
                accounts.push(child.key);
            });
            
            if (accounts) {
                _createPageStr(accounts.length, accounts);
            }
        });
    }

    // update to page
    function _createPageStr(len, names) {
        var str = `<div class="container row" style="text-align: left;">
                   <ul class="list-group">
                   <li class="list-group-item border border-dark content"><b>已綁定道號</b></li>
                   `;
        for (let i = 0; i < len; i++) {
            str += `
                <li class="list-group-item">${names[i]}</li>
                
                `;
        }
        str += `</ul></div>`
        allComments.innerHTML = str;
        cmtCnt.innerHTML = len;
    }

    function init() {
        _getData();
    }

    return {
        init
    }

})();
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
        content = $('#add-password').val();
        if (name != "" && content != "") {
            db.ref(`/accounts/${name}/password`).on('value', function (snapshot) {
                if (snapshot.exists()){
                    if (content != snapshot.val()) {
                        alert(`不是${name}嗎？`);
                        return false;
                    }
                }
                else {
                    alert(`${name}尚未綁定哦。`);
                    return false;
                }
                _getData(`${name}`)
            });
        }
    $('#myForm')[0].reset();
});


// get and display data
function _getData(name) {
    db.ref(`/accounts/${name}`).on('value', function (snapshot) {
        var data = snapshot.val();
        if (data) {
            _createPageStr(`${name}`, data.status, data.road);
        }
        return false;
    });
}

// update to page
function _createPageStr(name, status, road) {
    var roadStyle;
    var statusStyle;
    switch (road) {
        case '儒道':
            roadStyle = "text-white bg-primary";
            break;
        case '術道':
            roadStyle = "text-white bg-success";
            break;
        case '劍道':
            roadStyle = "text-dark bg-info";
            break;
        case '人皇道':
            roadStyle = "text-dark bg-warning";
            break;
        case '邪道':
            roadStyle = "text-white bg-danger";
            break;
        case '魔道':
            roadStyle = "text-white bg-dark";
            break;
        default:
            roadStyle = "text-dark bg-light";
    }
    switch (status) {
        case 1:
            statusStyle = "fs-5";
            break;
        case 2:
            statusStyle = "fs-4";
            break;
        case 3:
            statusStyle = "fs-3";
            break;
        case 4:
            statusStyle = "fs-2";
            break;
        case 5:
            statusStyle = "fs-1";
            break;
        default:
            statusStyle = "";
            break;
    }

    var str = ` <div class="card mb-3" style="max-width: 18rem;">
                    <div class="card-header ${roadStyle} second_topic">${name}</div>
                    <div class="card-body text-dark">
                        <h5 class="card-title">${road} 第${status}境</h5>
                    </div>
                    <div class="card-footer ${roadStyle}">修道第0天</div>
                </div>
                `;

    allContents.innerHTML = str;
}

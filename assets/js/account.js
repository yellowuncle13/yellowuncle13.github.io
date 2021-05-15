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
    var check = true,
        name = $('#floatingInput').val(),
        addPsd = $('#floatingPassword').val();
        if (name != "" && addPsd != "") {
            db.ref(`/accounts/${name}`).on('value', function (snapshot) {
                var password = snapshot.val();
                console.log(password);
                console.log(password == null);
                if (password != null) {
                    check = false;
                    alert(`${name}已經被綁定囉，換一個吧！`);
                }
                else if (check == true) {
                    db.ref(`/accounts/${name}`).set(addPsd);
                    alert(`${name}綁定成功，別忘記密碼囉！`);
                }
            });
        }
        $('#applyForm')[0].reset();
});
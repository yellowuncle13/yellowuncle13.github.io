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


function emptyForm()
{
    $('#updateNovelForm')[0].reset();
}

function updateNovel()
{
    var chaptNum = $("#add-chapt-num").val();
    var chaptContent = $("#add-chapt-content").val();
    if (chaptNum != "" && chaptNum != null && chaptContent != "" && chaptContent != null)
    {
        db.ref(`/accounts/yellowuncle/password`).once('value').then((snapshot) => {
            if (snapshot.exists()){
                var value = prompt("請輸入密碼：");
                if (value != snapshot.val()) {
                    alert(`不是小黃叔嗎？\n這裡是用來更新小說的哦！`);
                    return false;
                }
            }
            db.ref(`/novel/${chaptNum}`).set({
                content: chaptContent,
                time: _DateTimezone(8)
            });
            alert(`上傳第${chaptNum}章成功！ (${_DateTimezone(8)})`);
        });

        $('#updateNovelForm')[0].reset();
    }
}

function _DateTimezone(offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * offset)).toLocaleString();
}
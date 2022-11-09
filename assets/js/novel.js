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

var get_start_chapt = (function () {

    // get and display data
    function _getData() {
        db.ref(`/novel`).once('value').then((snapshot) => {
            var data = snapshot.val();
            if (data) {
                var contents = [];
                var times = [];
                var len = 0;

                for (let key in data) {
                    if(data[key].content.includes("\n"))
                    {
                        contents.push(data[key].content.split("\n").join("<br><br>"));
                    }
                    else
                    {
                        contents.push(data[key].content.split(" ").join("<br>"));
                    }
                    times.push(data[key].time);
                    len ++;
                }
                _createPageStr(len, contents, times);
            }
        });
    }

    // update to page
    function _createPageStr(len, contents, times) {
        var str = ``;
        for (let i = 0; i < len; i++) {
            str += 
            `
                <div class="second_topic">第${i+1}章</div>
                <br>
                <div class="content" id="${i+1}">
                    ${contents[i]}
                </div>

                <hr class="dropdown-divider">
                <div class="navbar align-self-center d-flex">
                    <a class="nav-link" href="index.html"><i class='bx bx-home bx-sm bx-tada-hover text-primary'></i></a>
                    <a class="nav-link" href="#${i+1}"><i class='bx bxs-chevrons-up bx-sm bx-tada-hover text-primary'></i></a>
                    <div id="cmtCnt${i+1}" class="badge bg-primary rounded-pill" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample${i+1}" aria-controls="offcanvasExample${i+1}">0</div>
                </div>
                <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample${i+1}" data-bs-keyboard="false" data-bs-backdrop="false" aria-labelledby="offcanvasExampleLabel">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasExampleLabel${i+1}">第${i+1}章評</h5>
                        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <div class="position-relative">
                            <div class="chat-messages p-4" style="height: 380px; max-height: 380px" id="scrollDown">

                                <div id="chapterChat${i+1}"></div>

                            </div>
                        </div>

                        <div class="flex-grow-0 py-3 px-4 border-top">
                            <div class="input-group">
                                <form id="applyForm">
                                    <input type="text" class="form-control" id="chatName${i+1}" maxlength="30" placeholder="名稱">
                                    <input type="text" class="form-control" id="chatInput${i+1}" maxlength="30" placeholder="留言">       
                                </form>
                                <button onclick="getContent(${i+1})" class="btn btn-dark">送出</button>
                            </div>
                        </div> 
                    </div>
                </div>
                <hr class="dropdown-divider"> 
            `;
        }
        novel.innerHTML = str;
    }

    function init() {
        _getData();
    }

    function nl2br(str){
        return str.replace("/(?:\r\n|\r|\n)/g", '<br>');
    }

    return {
        init
    }

})();




var get_start_chat = (function () {
    function init() {
        _getData();
    }
    function _getData() {
        db.ref(`/comments/chapters`).once('value').then((snapshot) => {
            var data = snapshot.val();
            if (data) {

                for (let chaptNum in data) {

                    db.ref(`/comments/chapters/${chaptNum}`).once('value').then((snapshot) => {
                        var chats = snapshot.val();
                        var names = [];
                        var contents = [];
                        var times = [];
                        var len = 0;
                        if (chats) {
                            for (let chat in chats) {
                                names.push(chats[chat].name);
                                contents.push(chats[chat].content);
                                times.push(chats[chat].time);
                                len ++;
                            }
                            _createChatPage(chaptNum, len, names, contents, times);
                        }
                    });
                }
            }
        });
    }

    // update to page
    function _createChatPage(chaptNum, len, names, contents, times) {
        var str = ``;
        var i = 0;
        for (i = 0; i < len; i++) {
            
            str += `
            <div class="card border border-dark">
                <div class="card-body">
                    <h5 class="card-title fs-5 fw-bold">${names[i]}</h5>
                    <h6 class="card-text fs-5" style="position: absolute; top: 3px; right: 5px; text-align:right;">#${i+1}</h6>
                    <h6 class="card-text text-muted" style="position: absolute; top: 30px; right: 5px; text-align:right; font-size: 10px;">${times[i]}</h6>
                    <hr class="dropdown-divider">
                    <p class="card-text fs-6 fw-bold">${contents[i]}</p>
                </div>
            </div>
                `;
        } 
        document.getElementById("chapterChat"+chaptNum).innerHTML = str;
        document.getElementById("cmtCnt"+chaptNum).innerHTML = len;
        var objDiv = document.getElementById("scrollDown");
        objDiv.scrollTop = objDiv.scrollHeight;
        db.ref(`/cmtCnt/${chaptNum}`).set(len);
    }

    return {
        init
    }
})();



function getContent(chaptNum)
{
    var name = $("#chatName"+chaptNum).val();
    var content = $("#chatInput"+chaptNum).val();
    if (content != "" && content != null)
    {
        db.ref(`/accounts/${name}/password`).once('value').then((snapshot) => {
            if (snapshot.exists()){
                var value = prompt("請輸入密碼：");
                if (value != snapshot.val()) {
                    alert(`不是${name}嗎？\n或是這個名稱已經被綁定囉，換一個吧！`);
                    return false;
                }
            }
            db.ref(`/comments/chapters/${chaptNum}`).push({
                name : name,
                content: content,
                status: "",
                type: "",
                upvote: 0,
                downvote: 0,
                time: _DateTimezone(8)
            });
        });

        $('#applyForm')[0].reset();
        get_start_chat.init();
    }
}

// time
function _DateTimezone(offset) {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * offset)).toLocaleString();
}

function goToChapt()
{
    var goTo = $("#goTo").val();
    document.getElementById(goTo).scrollIntoView({behavior: 'smooth'});
}

var get_latest_chapt = (function () {
    function init() {
        _getData();
    }

    function _getData()
    {
        var latestChapt = 0;
        db.ref(`/novel`).once('value').then((snapshot) => {
            var data = snapshot.val();
            if (data) {
                latestChapt = data.length - 1;
                document.getElementById("latestChapt").innerHTML = 
                    `
                    <div class="container py-3">
                        <div class="row projects gx-lg-5">
                            <a href="novel.html#2" class="col-sm-6 col-lg-3 text-decoration-none project marketing social business text-left">
                                <div class="overflow-hidden card mb-5 mx-5 m-sm-0">
                                    <div class="card-body">
                                        <h4 class="card-title text-dark">最新章節 第${latestChapt}章</h4>
                                        <p class="card-text text-dark">${data[latestChapt].time}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    `;
            }
        });
    }

    function goToLatestChapt()
    {
        document.getElementById(latestChapt).scrollIntoView({behavior: 'smooth'});
        return false;
    }

    return {
        init
    }
})();

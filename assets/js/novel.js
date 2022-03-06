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
        var name, 
            event = $('#floatingEvent').val();
        if(document.getElementById('floatingInput1').checked) {
            name = $('#floatingInput1').val();
          }else if(document.getElementById('floatingInput2').checked) {
            name = $('#floatingInput2').val();
          }
        
        if (name != "" && event != "") {
            db.ref(`/accounts/${name}`).push({
                event: event,
                time: _DateTimezone(8)
            });
            alert(`和${name}說一聲好棒喲！`);
        }
        $('#applyForm')[0].reset();
    });



    // get and display data
    function _getData() {
        db.ref(`/novel`).on('value', function (snapshot) {
            var data = snapshot.val();
            if (data) {
                var contents = [];
                var times = [];
                var len = 0;

                for (let key in data) {
                    contents.push(data[key].content.split(" ").join("<br>"));
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
                <div class="content">
                    ${contents[i]}
                </div>

                <hr class="dropdown-divider">
                <div class="navbar align-self-center d-flex">
                    <a class="nav-link" href="index.html"><i class='bx bx-home bx-sm bx-tada-hover text-primary'></i></a>
                    <a class="nav-link" href="#"><i class='bx bxs-chevrons-up bx-sm bx-tada-hover text-primary'></i></a>
                    <a class="nav-link" href="#"><i class='bx bx-chat bx-sm bx-tada-hover text-primary'></i></a>
                </div>
                <hr class="dropdown-divider"> 
            `;
        }
        novel.innerHTML = str;
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

    function nl2br(str){
        return str.replace("/(?:\r\n|\r|\n)/g", '<br>');
    }

    return {
        init
    }

})();
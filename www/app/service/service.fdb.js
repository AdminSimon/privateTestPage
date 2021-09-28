service.fdb = (function () {
    var _db = null;
    var _firebaseConfig = {
        apiKey: "AIzaSyDrWo0G-mMEinnQJzsaexi0_nse5slB75k",
        authDomain: "stktest-34841.firebaseapp.com",
        databaseURL: "https://stktest-34841.firebaseio.com",
        projectId: "stktest-34841",
        storageBucket: "stktest-34841.appspot.com",
        messagingSenderId: "881926814335",
        appId: "1:881926814335:web:b5de8bf4b29dd7f02b5d4a"
    };
    var init = function () {
        firebase.initializeApp(_firebaseConfig);
        _db = firebase.database();

        var usersRef = _db.ref('users');
        usersRef.on('value', function (snapshot) {
            var data = snapshot.val();
            console.warn('users change: ', data);
        })
    }
    return {
        init: init,
        onChatListner: function(roomId, callback){
            _db.ref('rooms/' + roomId + '/lastDate').on('value', function(){
                // 룸의 마지막 상태 변경감지
                callback && callback();
            })
            // _db.ref('rooms/' + roomId + '/lastMessage').on('value', function(){
            //     // 룸의 마지막 상태 변경감지
            //     callback && callback();
            // })
        },
        offChatListner: function(roomId){
            _db.ref('rooms/' + roomId + '/lastDate').off();
            // _db.ref('rooms/' + roomId + '/lastMessage').off();
        },
        accessEvent: function(callback){
            _db.ref('logined').on('value', function(snapshot){
                callback && callback(snapshot.val());
            });
            _db.ref('users').on('value', function(snapshot){
                callback && callback(snapshot.val());
            });
        },
        login: function(uid){
            if (!uid) {
                console.error('uid가 없습니다.');
                return;
            }
            return new Promise(function(res, rej){
                _db.ref().child('logined/'+uid).set(true).then(res);
            })
        },
        logout: function(uid){
            if (!uid) {
                console.error('uid가 없습니다.');
                return;
            }
            return new Promise(function(res, rej){
                _db.ref().child('logined/'+uid).set(null).then(res);
            })
        },
        logined: function(){
            return new Promise(function(res, rej){
                _db.ref().child('logined/'+uid).get().then(function(snapshot){
                    if (snapshot.exists()) {
                        console.log('fdb : logined : ', snapshot.val());
                        res(snapshot.val());
                    }
                });
            })
        },
        hasLogined: function(uid){
            if (!uid) {
                console.error('uid가 없습니다.');
                return;
            }
            return new Promise(function(res, rej){
                _db.ref().child('logined/'+uid).get().then(function(snapshot){
                    if (snapshot.exists()) {
                        console.log('fdb : hasLogined : ', snapshot.val());
                        res(snapshot.val());
                    }
                });
            })
        },
        
        users: function () {
            return new Promise(function (res, rej) {
                _db.ref().child('users').get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : users : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        getUser: function (uid) {
            if (!uid) {
                console.error('uid가 없습니다.');
                return;
            }
            return new Promise(function (res, rej) {
                _db.ref().child('users/' + uid).get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        // console.log('fdb : getUser : ', uid, snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        makeUser: function (name, personalColor) {
            return new Promise(function (res, rej) {
                var uid = _db.ref('users').push().key;
                _db.ref('users/' + uid).set({
                    name: name,
                    personalColor: personalColor
                }).then(res);
            })
        },
        deleteUser: function (uid) {
            if (!uid) {
                console.error('uid가 없습니다.');
                return;
            }
            return new Promise(function (res, rej) {
                var updates = {};
                updates['users/' + uid] = null;
                updates['logined/' + uid] = null;
                updates['userRooms/' + uid] = null;
                _db.ref('rooms').get().then(function(snapshot){
                    if(snapshot.exists()){
                        $.each(snapshot.val(), function(roomId, info){
                            updates['roomUsers/' + roomId + '/' + uid] = null;
                        })
                        _db.ref().update(updates).then(res);
                    }
                })
            })
        },
        getRoom: function(roomId){
            if (!roomId) {
                console.error('roomId가 없습니다.');
                return;
            }
            return new Promise(function (res, rej) {
                _db.ref().child('rooms/'+roomId).get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : getRoom : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        rooms: function(){
            return new Promise(function (res, rej) {
                _db.ref().child('rooms').get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : rooms : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        userRooms: function(uid){
            if (!uid) {
                console.error('uid가 없습니다.');
                return;
            }
            return new Promise(function (res, rej) {
                _db.ref().child('userRooms/'+uid).get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : userRooms : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        getRoomUser: function(roomId){
            if (!roomId) {
                console.error('roomId가 없습니다.');
                return;
            }
            return new Promise(function (res, rej) {
                _db.ref().child('roomUsers/'+roomId).get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : roomUser : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        roomUsers: function(){
            return new Promise(function (res, rej) {
                _db.ref().child('roomUsers').get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : roomUsers : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        messages: function(roomId){
            if (!roomId) {
                console.error('roomId가 없습니다.');
                return;
            }
            return new Promise(function (res, rej) {
                _db.ref().child('messages/'+roomId).get().then(function (snapshot) {
                    if (snapshot.exists()) {
                        console.log('fdb : messages : ', snapshot.val());
                        res(snapshot.val());
                    }
                })
            })
        },
        pushMessage: function(roomId, message, uid, uname){
            return new Promise(function (res, rej) {
                
                var mid = _db.ref('messages').push().key;
                _db.ref('messages/' + roomId + '/' + mid).set({
                    message: message,
                    profileImage: '',
                    timestamp: new Date().getTime(),
                    uid: uid,
                    uname: uname,
                }).then(function(){
                    var updates = {};
                    updates['rooms/' + roomId + '/lastMessage'] = message;
                    updates['rooms/' + roomId + '/lastDate'] = new Date().getTime();
                    _db.ref().update(updates).then(res);
                    // _db.ref('rooms/' + roomId + '/lastMessage').set(message).then(res);
                });
            })
        },
        joinRoom: function(uid, roomId){
            return new Promise(function(res, rej){

                _db.ref().child('rooms/'+roomId).get().then(function(snapshot){
                    if(snapshot.exists()){
                        var roomInfo = snapshot.val();

                        var updates = {};
                        updates['roomUsers/'+roomId+'/'+uid] = true;
                        updates['userRooms/'+uid+'/'+roomId] = roomInfo;
                        _db.ref().update(updates).then(res);
        
                        // _db.ref('roomUsers/' + roomId + '/' + uid).set(true).then(res);
                    }
                })
            })
        },
        outRoom: function(uid, roomId){
            return new Promise(function(res, rej){
                var updates = {};
                updates['roomUsers/'+roomId+'/'+uid] = null;
                updates['userRooms/'+uid+'/'+roomId] = null;
                _db.ref().update(updates).then(res);
            })
        },





        writeUser2: function () {
            var userId = 'c001'
            _db.ref('users/' + userId).set({
                name: '이우주2',
                personalColor: 'red2',
            });
        },
        newUser2: function () {
            var key = _db.ref('users').push().key;
            console.warn('new key', key);
        },
        updateUser2: function () {
            var userId = 'c001';
            _db.ref().child('users')
        },
        customeUser2: function (id, username) {
            _db.ref('users/' + id).set({
                username: username,
            });
        },
        getUsers2: function () {
            _db.ref().child('users').get().then(function (snapshot) {
                if (snapshot.exists()) {
                    console.log('list', snapshot.val());
                }
            })
        },
    };
})();

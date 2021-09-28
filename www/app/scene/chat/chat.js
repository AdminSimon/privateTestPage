scene.chat = (function () {
    var _this = $('#chat');
    var _elem = {
        me: _this.find('.user-avatar'),
        chatList: _this.find('.chat-list'),
        message: _this.find('.input-box input'),
        send: _this.find('.input-box .send'),
        chatout: _this.find('.chat-out'),
    };
    var _socket = null;
    var _user = null;

    var _uid = null;
    var _roomId = null;

    var _joinUsers = null;

    var handler = (function () {
        _this.find('.history-back').on('click', function () {
            history.back();
        })
        _elem.send.on('click', function () {
            var message = _elem.message.val();
            _elem.message.val('');
            send(message);

        })

        _elem.message.keydown(function (key) {
            if (key.keyCode == 13) {
                var message = _elem.message.val();
                _elem.message.val('');
                send(message);
            }
        })
        _elem.chatout.on('click', function () {
            if (confirm('채팅방에서 나가시겠습니까?')) {
                service.fdb.outRoom(_uid, _roomId).then(function () {
                    history.back();
                })
            }
        })
    })();

    var appendChat = function (who, id, name, time, message) {
        var currentTime = service.filter.getCurrentDate(time).split(' ')[1];
        var replaceStr = service.filter.parseUrl(message);
        var itemView = $(
            '<div class="i-chat" data-user-id="' + id + '">' +
            '    <div class="inner">' +
            '        <div class="avatar" style="background-color: '+(_joinUsers[id] != null ? _joinUsers[id].personalColor : '#dee8ea')+';">' + name + '</div>' +
            '        <div class="message-wrapper">' +
            '            <div class="message">' + replaceStr + '</div>' +
            '            <div class="date-time">' + currentTime + '</div>' +
            '        </div>' +
            '    </div>' +
            '</div>'
        );

        if(_joinUsers[id] == undefined){
            itemView.addClass('removed-user');
        }

        if (who == 'me') {
            itemView.addClass('chat-me');
            _elem.chatList.find('.i-chat.chat-me').each(function () {
                var dateTime = $(this).find('.date-time').html();
                if (currentTime == dateTime) {
                    $(this).find('.date-time').css('opacity', '0');
                }
            })
        } else {
            itemView.addClass('chat-other');
            _elem.chatList.find('.i-chat.chat-other').each(function () {
                var dateTime = $(this).find('.date-time').html();
                if (currentTime == dateTime) {
                    $(this).find('.date-time').css('opacity', '0');
                }
            })
        }
        _elem.chatList.append(itemView);

    }

    var send = function (message) {
        console.warn('message: ', message);
        if (message && message != '') {
            service.fdb.getUser(_uid).then(function (user) {
                service.fdb.pushMessage(_roomId, message, _uid, user.name).then(function () {
                    // _elem.chatList.empty();
                    // renderChats(_roomId);
                })
            })

            if (_socket) {
                _socket.emit('message', message, _roomId);
            }
        }
    }

    var renderView = function (uid, roomId) {
        return new Promise(function(res, rej){
            _uid = uid;
            _roomId = roomId;
            var chatName = '';
            service.fdb.getUser(uid).then(function (user) {
                renderMe(user.name, user.personalColor);
                renderUsers(roomId, function(){
    
                    renderChats(roomId, function(){
                        res();
                    });
                });
            })
        });
    }

    var renderMe = function (name, color) {
        _elem.me.css('background-color', color);
        _elem.me.find('.user-name').html(name);
    }
    var renderUsers = function (roomId, callback) {
        service.fdb.getRoom(roomId).then(function(room){

            service.fdb.getRoomUser(roomId).then(function (users) {
                var prom = [];            
                $.each(users, function(uid, flag){
                    if(flag){
                        prom.push(service.fdb.getUser(uid).then(function(user){
                            users[uid] = user;
                        }));
                    }
                })
                Promise.all(prom).then(function(){
                    _joinUsers = users;
                    var userNames = [];
                    $.each(_joinUsers, function(uid, user){
                        userNames.push(user.name);
                    })
                    var headText = '<strong>' + room.roomName + '</strong> - ' + userNames.join('/');
                    _this.find('.chat-info .name').html(headText);
    
                    callback && callback();
                })
            })
        })
    }
    var renderChats = function (roomId, callback) {
        _elem.chatList.empty();
        service.fdb.messages(roomId).then(function (msgs) {
            $.each(msgs, function (msgId, msgObj) {
                appendChat((msgObj.uid == _uid ? 'me' : ''), msgObj.uid, msgObj.uname, msgObj.timestamp, msgObj.message);
            })
            _elem.chatList.animate({
                scrollTop: _elem.chatList[0].scrollHeight
            }, 0);
            callback && callback();
        })
    }

    var setupSocket = function (roomId) {
        if (_socket) {
            _socket.disconnect();
        }
        _socket = io('http://white.jungli.net:9107', {
            query: {
                'room-id': roomId,
            }
        });
        _socket.on('connect', function () {
            console.log('[[ 채팅서버 연동 성공 ]]');
        })
        _socket.on('connect_error', function () {
            console.error('[[ 채팅서버 연동 오류 ]]');
        })
        _socket.on('disconnect', function (reason) {
            console.log('[[ 채팅서버 해제 ]]', reason);

        })



        _socket.on('usercount', function (count) {
            console.warn('user count!', count);
            _this.find('.count').html(count);
        })
        _socket.on('message', function (msgObj) {
            console.warn('received msg', msgObj);
            renderChats(_roomId);
        })
    }

    var firebaseChangeListener = {
        start: function(roomId){
            service.fdb.onChatListner(roomId, function(){
                if(_joinUsers){
                    renderChats(roomId);
                }
            })
        },
        stop: function(roomId){
            if(roomId){
                service.fdb.offChatListner(roomId);
            }
        }
    }

    var open = function () {
        _this.show();
    }
    var close = function () {
        firebaseChangeListener.stop(_roomId);
        _elem.chatList.empty();
        _this.hide();
    }
    return {
        init: function (callback, uid, roomId) {
            renderView(uid, roomId).then(function(){
                // setupSocket(roomId);
                firebaseChangeListener.start(roomId);
            });

            callback && callback();
        },
        getSceneName: function () {
            return _this.attr('id');
        },
        open: open,
        close: close,
    }
})();
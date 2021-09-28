scene.chatlist = (function () {
    var _this = $('#chatlist');
    var _elem = {
        me: _this.find('.user-avatar'),
        myChats: _this.find('.my-rooms'),
        rooms: _this.find('.rooms'),
    };
    var _uid = null;

    var handler = (function () {
        _this.find('.history-back').on('click', function(){
            service.fdb.logout(_uid).then(function(){
                history.back();
            })
        })
        _elem.myChats.on('click', '.i-room', function () {
            var roomId = $(this).data('room-id');
            sceneManager.change('chat/' + _uid + '/' + roomId);
        })
        _elem.rooms.on('click', '.i-room', function () {
            var roomId = $(this).data('room-id');
            if (confirm('채팅방에서 참여하시겠습니까?')) {
                service.fdb.joinRoom(_uid, roomId).then(function(){
                    renderView(_uid);
                    sceneManager.change('chat/' + _uid + '/' + roomId);
                });
            }
        })
    })();

    var renderMe = function(uid){
        service.fdb.getUser(uid).then(function(user){
            _elem.me.css('background-color', user.personalColor);
            _elem.me.find('.user-name').html(user.name);
        })        
    }

    var renderView = function (uid) {
        _uid = uid;

        _elem.myChats.empty();
        _elem.rooms.empty();

        Promise.all([
            service.fdb.rooms(),
            service.fdb.users(),
            service.fdb.roomUsers(),
        ]).then(function(rs){
            var rooms = rs[0];
            var users = rs[1];
            var roomUsers = rs[2];
            var roomAll = [];

            $.each(roomUsers, function(roomId, userFlags){

                var roomItem = rooms[roomId];
                roomItem['roomId'] = roomId;
                roomItem['users'] = [];
                roomItem['owner'] = userFlags[uid] ? true : false;
                $.each(userFlags, function(uid, flag){
                    if(flag){
                        var userInfo = users[uid];
                        userInfo['id'] = uid;
                        roomItem['users'].push(userInfo);
                    }
                })
                roomAll.push(roomItem);
            })
            console.warn('roomall--------', roomAll);

            $.each(roomAll, function(i, roomItem){
                // var itemView = $('<li class="i-room" data-room-id="' + roomItem.roomId + '"><div class="name">' + roomItem.roomName + '</div><div class="users">참여자: </div></li>');                
                var itemView = $(
                    '<div class="i-room" data-room-id="'+roomItem.roomId+'">' +
                    '    <div class="name">'+roomItem.roomName+'</div>' +
                    '    <div class="last-message">마지막: <div class="msg-txt">'+roomItem.lastMessage+'</div></div>' +
                    '    <div class="users">참여자: </div>' +
                    '</div>'
                );

                $.each(roomItem.users, function (i, user) {
                    itemView.find('.users').append('<div class="join-user" data-uid="'+user.id+'"><div class="avatar" style="background-color: '+user.personalColor+';"></div>' + user.name + '</div>');
                })
                if(roomItem.owner){
                    itemView.addClass('my-room');
                    _elem.myChats.append(itemView);
                    
                }else{
                    itemView.addClass('other-room');
                    _elem.rooms.append(itemView);
                }
            })
        })

    }


    var open = function () {
        _this.show();
    }
    var close = function () {
        _this.hide();
    }
    return {
        init: function (callback, uid) {
            renderView(uid);
            renderMe(uid);
            callback && callback();
        },
        getSceneName: function () {
            return _this.attr('id');
        },
        open: open,
        close: close,
    }
})();
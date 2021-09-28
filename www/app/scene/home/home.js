scene.home = (function(){
    var _this = $('#home');
    var _elem = {};
    var _isFirst = true;
    var handler = (function(){
        _this.find('.customers').on('click', '.i-customer', function(){
            if($(this).hasClass('has-logined')){
                return;
            }
            var item = $(this).data('model');
            var uid = $(this).data('uid');
            console.log('customer item : ', uid);

            service.fdb.getUser(uid).then(function(user){
                console.log('user', user);
                service.fdb.login(uid).then(function(){
                    sceneManager.change('chatlist/' + uid);
                })
            })
        })
        _this.find('.customers').on('click', '.i-customer .delete', function(e){
            e.stopPropagation();
            var uid = $(this).closest('.i-customer').data('uid');
            console.log('customer item delete : ', uid);
            if (confirm('삭제 하겠습니까?')) {
                service.fdb.deleteUser(uid).then(function(){
                    renderView();
                });
            }
        })
        _this.find('.make').on('click', function(){
            var name = _this.find('.new-user .name').val();
            var personalColor = _this.find('.new-user .personal-color').val();
            if(!name || !personalColor) {
                return;
            }
            if (confirm('생성 하겠습니까?')) {
                service.fdb.makeUser(name,personalColor).then(function(){
                    renderView();
                });
            }
        })
    })();

    var renderView = function(){
        _this.find('.customers').empty();

        service.fdb.users().then(function(users){
            $.each(users, function(uid, item){
                var itemView = $('<li class="i-customer" data-uid="'+uid+'"><div class="avatar" style="background-color: '+item.personalColor+';"></div><div class="name">'+item.name+'</div><div class="is-login">로그인중</div><div class="delete">삭제</div></li>');
                itemView.data('model', item);
                _this.find('.customers').append(itemView);                
            })
            _this.find('.customers .i-customer').each(function(){
                var _target = $(this);
                var uid = $(this).data('uid');
                service.fdb.hasLogined(uid).then(function(hasLogined){
                    console.warn('is!',uid, hasLogined);
                    if(hasLogined){
                        _target.addClass('has-logined');
                    }
                })
            })
        })

    }

    var open = function(){
        _this.show();    
    }
    var close = function(){
        _this.hide();
    }
    return {
        init: function(callback){
            if(_isFirst){
                _isFirst = false;
                service.fdb.accessEvent(function(){
                    renderView();
                })
            }
            // renderView();
            callback && callback();
        },
        getSceneName: function(){
			return _this.attr('id');
		},
        open: open,
        close: close,
    }
})();

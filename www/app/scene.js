var sceneManager = {
	activeScene : 'isFirst', 
	init : function(){
		var preProcess = function(willScene, callback){
			if(sceneManager.activeScene != 'isFirst'){
				scene[sceneManager.activeScene].close();
			}
			callback && callback();
		};
		
		routie({			
			'home' : function(){
				var Scene = scene.home;
				preProcess(Scene, function(){
					Scene.init(function(){
						Scene.open();
						sceneManager.activeScene = Scene.getSceneName();
					});
				});
			},
			'chatlist/:uid' : function(uid){
				var Scene = scene.chatlist;
				preProcess(Scene, function(){
					Scene.init(function(){
						Scene.open();
						sceneManager.activeScene = Scene.getSceneName();
					}, uid);
				});
			},
			'chat/:uid/:roomId' : function(uid, roomId){
				var Scene = scene.chat;
				preProcess(Scene, function(){
					Scene.init(function(){
						Scene.open();
						sceneManager.activeScene = Scene.getSceneName();
					}, uid, roomId);
				});
			},
			'*' : function(){
                sceneManager.change('home');
			},
		});

		window.onhashchange = function() {
			if( window.cordova ) {

			} else {

			}
		}
	},
	change : function(path){
		document.location.hash = path;
	}
}

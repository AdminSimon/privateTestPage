var loader = {
    initialize: function(){
        if(window.cordova){
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }else{
            this.onDeviceReady();
        }
    },
    onDeviceReady: function(){
        setTimeout(function(){
            service.fdb.init();
            sceneManager.init();
        }, 500);
    }
}
loader.initialize();
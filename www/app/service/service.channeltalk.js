service.channeltalk = (function () {
    var loadScript = function() {
        var w = window;
        if (w.ChannelIO) {
            return (window.console.error || window.console.log || function () {})('ChannelIO script included twice.');
        }
        var ch = function () {
            ch.c(arguments);
        };
        ch.q = [];
        ch.c = function (args) {
            ch.q.push(args);
        };
        w.ChannelIO = ch;

        function l() {
            if (w.ChannelIOInitialized) {
                return;
            }
            w.ChannelIOInitialized = true;
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
            s.charset = 'UTF-8';
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }
        if (document.readyState === 'complete') {
            l();
        } else if (window.attachEvent) {
            window.attachEvent('onload', l);
        } else {
            window.addEventListener('DOMContentLoaded', l, false);
            window.addEventListener('load', l, false);
        }
    }

    var boot = function(settings) {
        window.ChannelIO('boot', settings, function onBoot(error, user){
            if(error){
                console.error(error);
            }else{
                console.log('boot success', user);
                // window.ChannelIO('showMessenger');

                // window.ChannelIO('openChat', '6131a561dbd0f0a3ca51', 'message test');
                // window.ChannelIO('openChat', undefined, 'message test');
            }
        });
    }

    var shutdown = function () {
        window.ChannelIO('shutdown');
    }
    var handler = (function () {
        loadScript();
        boot({
            pluginKey: "1e59756c-0ad9-4175-ab13-8dd1d5bfdad0",
            hidePopup: false,
            mobileMessengerMode: 'iframe',
            language: "ko",

            // memberId: 'string: 우리 서비스에서 사용하는 고객ID',
            // customLauncherSelector: "string: css 셀렉터. hideChannelButtonOnBoot: true 와 같이 사용됨",
            // hideChannelButtonOnBoot: "boolean: 버튼 유무.",
            // zIndex : "integer: 깊이",
            // trackDefaultEvent: 'boolean: Whether to send default events (usually PageView). Default value is true',
            // trackUtmSource: 'boolean: Flag to decide whether to track UTM source and referrer or not. Default value is true',
            // unsubscribed: 'boolean: unsubscribed',
            // memberHash: 'string: the hashed value of memberId using SHA256',
            // profile: {},


        })
        // var settings = {
        //     "pluginKey": "YOUR_PLUGIN_KEY",
        //     "memberId": "YOUR_USER_ID",
        //     "customLauncherSelector": ".custom-button-1, #custom-button-2",
        //     "hideChannelButtonOnBoot": true,
        //     "trackDefaultEvent": false,
        //     "trackUtmSource": false,
        //     "openChatDirectlyAsPossible": true,
        //     "mobileMessengerMode": "newTab",
        //     "zIndex": 1,
        //     "language": "en",
        //     "profile": {
        //       "name": "YOUR_USER_NAME",
        //       "mobileNumber": "YOUR_USER_MOBILE_NUMBER",
        //       "email": "your@email.com",
        //       "avatarUrl": "http://IMAGE_URL",
        //       "CUSTOM_VALUE_1": "VALUE_1",
        //       "CUSTOM_VALUE_2": "VALUE_2"
        //     },
        //     "unsubscribed": false,
        //     "memberHash": <generted_hash>,
        //     "hidePopup": false,
        // };
    })()
})();

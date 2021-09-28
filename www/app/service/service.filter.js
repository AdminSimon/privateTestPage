service.filter = (function () {
    return {
        getCurrentDate: function (time) {
            if(time){
                time = Number(time);
            }
            var date = new Date(time);
            var monthAdd = date.getMonth() + 1;
            var month = monthAdd.toString().length == 1 ? '0' + monthAdd : monthAdd;
            var day = date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate();
            var year = date.getFullYear();
            var hours = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
            var minutes = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds().toString().length == 1 ? '0' + date.getSeconds() : date.getSeconds();
            var formattedTime = year + '-' + month + '-' + day;
            formattedTime = formattedTime + ' ' + hours + ':' + minutes;
            return formattedTime;
        },
        parseUrl: function(str){
            var replaceStr = str;

            var domExp = {
                dom: /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi,
                par: /(http(s)?:\/\/|www.)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}([\/a-z0-9-%#?&=\w])+(\.[a-z0-9]{2,4}(\?[\/a-z0-9-%#?&=\w]+)*)*/gi
            }
            var arr = [];
            str.replace(domExp.par, function (n) {
                arr.push(n)
            })
            $.each(arr, function(i, urlText){
                var regEx = new RegExp(urlText, 'gi');
                replaceStr = replaceStr.replace(regEx, '<a href="'+urlText+'">'+urlText+'</a>');
            })
            return replaceStr;
        }
    }
})();
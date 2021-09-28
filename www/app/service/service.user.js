service.user = (function () {
    var getInfo = function(id){
        if(id){
            var filterd = $customers.filter(function(item){
                return item.id == id;
            })[0];
            if(filterd){
                return filterd;
            }else {
                return null;
            }
        }
    }
    var getPartner = function(id){
        if(id){
            var filterd = $planners.filter(function(item){
                return item.id == id;
            })[0];
            if(filterd){
                return filterd;
            }else {
                return null;
            }
        }
    }
    return {
        getInfo: getInfo,
        getPartner: getPartner,
    }
})();
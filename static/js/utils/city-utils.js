var city = {
    cityJson: "",
    getProvince: function (provinceId) {
        var emptyObj = {children: []};
        for (var i = 0; i < this.cityJson.length; ++i) {
            if (this.cityJson[i].id === parseInt(provinceId)) {
                return this.cityJson[i] || emptyObj;
            }
        }
        return emptyObj;
    },
    getProvinceName: function (provinceId) {
        return this.getProvince(provinceId).name || "";
    },

    getCity: function (cityId) {
        var emptyObj = {children: []};
        var provId = parseInt((cityId + "").substring(0, 2));
        var prov = this.getProvince(provId);
        for (var i = 0; i < prov.children.length; ++i) {
            if (prov.children[i].id === parseInt(cityId)) {
                return prov.children[i] || emptyObj;
            }
        }
        return emptyObj;
    },
    getCityName: function (cityId) {
        return this.getCity(cityId).name||"";
    },

    getDist: function (distId) {
        var cityId = parseInt((distId + "").substring(0, 4));
        var city = this.getCity(cityId);
        for (var i = 0; i < city.children.length; ++i) {
            if (city.children[i].id === parseInt(distId)) {
                return city.children[i] || {};
            }
        }
        return {};
    },

    getDistName: function (distId) {
        return this.getDist(distId).name||"";
    }
};

(function () {
    var ajax;
    if (window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        ajax = new window.ActiveXObject();
    } else {
        alert("请升级至最新版本的浏览器");
    }
    if (ajax != null) {
        ajax.open("GET", "/js/city.json", true);
        ajax.send(null);
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                city.cityJson = JSON.parse(ajax.responseText);
            }
        };
    }
})();

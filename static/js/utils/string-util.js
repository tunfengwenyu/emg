String.prototype.render = function (object, convertRule) {
    return this.replace(/{{(.*?)}}/g, function (match, key) {
        if (convertRule && convertRule[key.trim()]) {
            return convertRule[key.trim()](object[key.trim()],object);
        }
        return object[key.trim()] === undefined ? "" : object[key.trim()];
    });
};
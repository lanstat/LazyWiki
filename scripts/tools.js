if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

if (!String.prototype.formatMatch) {
    String.prototype.formatMatch = function(data) {
        return this.replace(/{(\w+)}/g, function(match, keyword) {
            return typeof data[keyword] !== 'undefined'
                ? data[keyword]
                : match
                ;
        });
    };
}

window.goTo = function (id) {
    if( !id) return;
    var element = document.getElementById(id);

    document.body.scrollTop = element.offsetTop + 60;
    return false;
};

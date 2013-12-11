FoxSaver.Rss._source = function(B, A) {
    return new FoxSaver.RssSource(B.getUrl(A), B.parse)
};
FoxSaver.Rss.caseSettings = new Array();
FoxSaver.Rss.source = function(A) {
    var C;
    var D = {inCase: function(E) {
            return true
        }, weDo: function(E) {
            C = FoxSaver.Rss._source(FoxSaver.Rss.Default, E)
        }};
    var B = FoxSaver.Rss.caseSettings.map(function(E) {
        return{inCase: function(F) {
                return F.indexOf(E.keyword) > 0
            }, weDo: function(F) {
                C = FoxSaver.Rss._source(E.feed, F)
            }}
    });
    B.push(D);
    FoxSaver.log(B.length);
    FoxSaver.Util.switchCase(A, B);
    return C
}
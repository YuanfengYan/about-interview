var toolTipFactory = (function() {
    var toolTipPool = [];
 
    return {
        create: function() {
            if (toolTipPool.length === 0) {
                var div = document.createElement("div");
                document.body.appendChild(div);
                console.log("div created");
                return div;
            } else {
                return toolTipPool.shift();
            }
        },
        recover: function(toolTipDom) {
            return toolTipPool.push(toolTipDom);
        }
    }
})();
 
var a = [];
for (var i = 0, str; str = ['A', 'B'][i]; i++) {
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    a.push(toolTip);
}
// 回收进对象池
a.forEach(function(toolTip) {
    toolTipFactory.recover(toolTip);
});
 
// 再创建6个小气泡
setTimeout(function() {
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(function(str) {
        var toolTip = toolTipFactory.create();
        toolTip.innerHTML = str;
    });
}, 500);
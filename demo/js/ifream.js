var objectPoolFactory = function(createObjFn) {
	var objectPool = [];
 
	return {
		create: function() {
			var obj = objectPool.length === 0 ?
				createObjFn.apply(this, arguments) : objectPool.shift();
			return obj;
		},
		recover: function(obj) {
			objectPool.push(obj);
		}
	}
};
 
// test
var iframeFactory = objectPoolFactory(function() {
	var iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
    console.log('create')
	iframe.onload = function() {
		iframe.onload = null;   // 防止iframe重复加载
		iframeFactory.recover(iframe); // iframe加载完了回收节点
	}
	return iframe;
});
 
var iframe1 = iframeFactory.create();
iframe1.src = 'https://www.baidu.com';
 
var iframe2 = iframeFactory.create();
iframe2.src = 'http://www.qq.com/';
 
setTimeout(function() {
    
	var iframe3 = iframeFactory.create();
	iframe3.src = 'http://www.163.com';
}, 6750);
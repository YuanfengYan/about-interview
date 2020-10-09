// 发布者
function Dep(){
  this.subs = []
}
Dep.prototype = {
  notify:function(){
    this.subs.forEach(function(item){
      item.updata()
    })
  },
  addSub:function(watcher){
    this.subs.push(watcher)
  }
}
Dep.target = null

// 订阅者
function Watcher(vm, exp, cb){
  this.vm = vm
  this.cb = cb
  this.exp = exp
  this.get()
}
Watcher.prototype = {
  updata:function(){
    this.run()
  },
  run:function(){
    var value = this.vm.data[this.exp]
    this.cb.call(this.vm, value);
  },
  get:function(){
    debugger
    Dep.target = this
    var value = this.vm.data[this.exp]
    Dep.target = null 
    return value
  }
}


// 观察者
function Observer(data){
  this.data = data
  this.walk(data)
}
Observer.prototype = {
  walk:function(data){
    var self = this
    Object.keys(data).forEach(function(key) {
      // self.defineReactive(data, key, data[key]);
      self.defineReactive(data,key,data[key])
  });
  },
  defineReactive:function(data, key, val){
    var dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        if (Dep.target) {
            //判断订阅者是否是第一次调用get，如果是第一次，将它添加到发布者数组里；
            dep.addSub(Dep.target);
        }
        return val;
      },
      set: function(newVal) {
          if (newVal === val) {
              return;
          }
          debugger
          val = newVal;
          dep.notify();
      }
    })
  }
}
function observer(data){
  return new Observer(data)
}

function Compile(el, vm){
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init()
  // this.fragment = document.createDocumentFragment()
  // var rootel = document.querySelector(el)
  
}
Compile.prototype = {
  init:function(){
    if(this.el){
      this.fragment = this.nodeToFragment()
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
      // debugger
    }else{
      console.log('找不到dom')
    }
  },
  nodeToFragment:function(){
      var fragment = document.createDocumentFragment()
      while(this.el.firstChild){
        fragment.appendChild(this.el.firstChild)
      }
      return fragment
  },
  compileElement:function(el){
    var childNodes = el.childNodes||[]
    var self = this
    childNodes.forEach(function(node){
      // debugger
      console.log(node.textContent,node.nodeType)
      var reg = /\{\{(.*)\}\}/;
      if(node.nodeType==1){//元素节点
        
      }else if(node.nodeType == 3 && reg.test(node.textContent)){ //文本节点
        self.compileText(node, reg.exec(node.textContent)[1])
       
      }
      if(node.childNodes&&node.childNodes.length>0){
        self.compileElement(node)
      }
    })
  },
  compileText(node, exp){
    var self = this
    var initText = this.vm.data[exp]
    // 此处优化 保留其他非双向绑定数据
    // node.textContent = initText
    this.updateText(node,initText)
    debugger
    new Watcher(this.vm, exp,function(value){
        self.updateText(node,value)
    })
  },
  updateText: function (node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
}

function SelfVue (options) {
  var self = this;
  this.vm = this;
  this.data = options.data;

  Object.keys(this.data).forEach(function(key) {
      self.proxyKeys(key);
  });

  observer(this.data);
  new Compile(options.el, this.vm);
  return this;
}
SelfVue.prototype = {
  proxyKeys: function (key) {
      var self = this;
      Object.defineProperty(this, key, {
          enumerable: false,
          configurable: true,
          get: function proxyGetter() {
              return self.data[key];
          },
          set: function proxySetter(newVal) {
              self.data[key] = newVal;
          }
      });
  }
}
vue = new SelfVue({
  el:'#root',
  data:{
    name:123
  }
})
window.vue = vue
// setTimeout(function(){
//   console.log(vue)
//   vue.name=123445
// },1000)
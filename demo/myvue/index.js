

//发布者类
function Dep () {
  //subs数组存储订阅者
  this.subs = [];
}
Dep.prototype = {
  //添加订阅者
  addSub: function(sub) {
      this.subs.push(sub);
  },
  //通知所有订阅者执行update方法
  notify: function() {
      this.subs.forEach(function(sub) {
          sub.update();
      });
  }
};
//target为静态属性，Wathcer部分有使用解释；
Dep.target = null;

// 观察者
function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
      var self = this;
      Object.keys(data).forEach(function(key) {
          self.defineReactive(data, key, data[key]);
      });
  },
  defineReactive: function(data, key, val) {
      var dep = new Dep();
      //当属性为对象时，要递归遍历；
      var childObj = observe(val);
      //将属性变为响应式
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
              val = newVal;
              dep.notify();
          }
      });
  }
};

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
      return;
  }
  return new Observer(value);
};

// 订阅者
// vm实例对象 exp对应的data、function表达式 cb 回调函数一般是 dom绑定的数据变化{{}} v-model等
function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  //在第一次获取data的属性值时，将自己添加进该属性值订阅器
  this.value = this.get();
}

Watcher.prototype = {
  //发布者notify时调用的回调函数；
  update: function() {
      this.run();
  },
  run: function() {
      var value = this.vm.data[this.exp];
      var oldVal = this.value;
      if (value !== oldVal) {
          this.value = value;
          this.cb.call(this.vm, value, oldVal);
      }
  },
  get: function() {
      Dep.target = this;  // 缓存自己
      var value = this.vm.data[this.exp]  // 执行监听器里的get函数，把自己添加为订阅者
      Dep.target = null;  // 释放自己
      return value;
  }
};


function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null;
  this.init();
}

Compile.prototype = {
  init: function () {
      if (this.el) {
          this.fragment = this.nodeToFragment(this.el);
          this.compileElement(this.fragment);
          this.el.appendChild(this.fragment);
      } else {
          console.log('Dom元素不存在');
      }
  },
  nodeToFragment: function (el) {
      var fragment = document.createDocumentFragment();
      var child = el.firstChild;
      while (child) {
          // 将Dom元素移入fragment中
          fragment.appendChild(child);
          child = el.firstChild
      }
      return fragment;
  },
  compileElement: function (el) {
      var childNodes = el.childNodes;
      var self = this;
      [].slice.call(childNodes).forEach(function(node) {
          var reg = /\{\{(.*)\}\}/;
          var text = node.textContent;
            // 元素节点
          if (self.isElementNode(node)) {  
              self.compile(node);
            //   文本节点
          } else if (self.isTextNode(node) && reg.test(text)) {
              self.compileText(node, reg.exec(text)[1]);
          }

          if (node.childNodes && node.childNodes.length) {
              self.compileElement(node);
          }
      });
  },
  compile: function(node) {
      var nodeAttrs = node.attributes;
      var self = this;
      Array.prototype.forEach.call(nodeAttrs, function(attr) {
          var attrName = attr.name;
          if (self.isDirective(attrName)) {
              var exp = attr.value;
              var dir = attrName.substring(2);
              if (self.isEventDirective(dir)) {  // 事件指令 v-onClick
                // exp对应事件触发的回调函数
                  self.compileEvent(node, self.vm, exp, dir);
              } else {                          // v-model 指令
                // exp对应绑定的data变量
                  self.compileModel(node, self.vm, exp, dir);
              }
              node.removeAttribute(attrName);
          }
      });
  },
  compileText: function(node, exp) { 
      var self = this;
      var initText = this.vm[exp];
      this.updateText(node, initText);
      new Watcher(this.vm, exp, function (value) {
          self.updateText(node, value);
      });
  },
  compileEvent: function (node, vm, exp, dir) {
      var eventType = dir.split(':')[1];
      var cb = vm.methods && vm.methods[exp];

      if (eventType && cb) {
          node.addEventListener(eventType, cb.bind(vm), false);
      }
  },
  compileModel: function (node, vm, exp, dir) {
      var self = this;
      var val = this.vm[exp];
      this.modelUpdater(node, val);
      new Watcher(this.vm, exp, function (value) {
          self.modelUpdater(node, value);
      });

      node.addEventListener('input', function(e) {
          var newValue = e.target.value;
          if (val === newValue) {
              return;
          }
          self.vm[exp] = newValue;
          val = newValue;
      });
  },
  updateText: function (node, value) {
      node.textContent = typeof value == 'undefined' ? '' : value;
  },
  modelUpdater: function(node, value, oldValue) {
      node.value = typeof value == 'undefined' ? '' : value;
  },
  isDirective: function(attr) {
      return attr.indexOf('v-') == 0;
  },
  isEventDirective: function(dir) {
      return dir.indexOf('on:') === 0;
  },
  isElementNode: function (node) {
      return node.nodeType == 1;
  },
  isTextNode: function(node) {
      return node.nodeType == 3;
  }
}


function SelfVue (options) {
  var self = this;
  this.vm = this;
  this.data = options.data;

  Object.keys(this.data).forEach(function(key) {
      self.proxyKeys(key);
  });

  observe(this.data);
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
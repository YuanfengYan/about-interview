# map和object区别

+ 1：Object对象有原型， 也就是说他有默认的key值在对象上面， 除非我们使用Object.create(null)创建一个没有原型的对象；

+ 2: 在Object对象中， 只能把String和Symbol作为key值， 但是在Map中，key值可以是任何基本类型(String, Number, Boolean, undefined, NaN….)，或者对象(Map, Set, Object, Function , Symbol , null….);

+ 3: 通过Map中的size属性， 可以很方便地获取到Map长度， 要获取Object的长度， 你只能用别的方法了；

+ 4: Map实例对象的key值可以为一个数组或者一个对象，或者一个函数，比较随意 ，而且Map对象实例中数据的排序是根据用户push的顺序进行排序的， 而Object实例中key,value的顺序就是有些规律了， (他们会先排数字开头的key值，然后才是字符串开头的key值)；

+ 5: Map 有迭代器接口 object 没有
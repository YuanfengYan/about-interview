# 前端生成pdf

## 简介
  
  两种方案：
  - 截取html屏幕，进行绘制图片上去（html2canvas + jspdf）
  - 直接使用jspdf进行布局 （jspdf） 包含其他插件 jspdf-autotable（绘制表格） svg2pdf(绘制svg)

## 一、 方案一 

- 只是大概实现了，具体代码需要微调

实现思路：
1. 将dom通过html2canvs转换为图片
2. 将dom下标记的各个块集不可分割的dom，进行计算拿到对应显示的高度
3. 每个页面进行绘制这个图到pdf上，唯一不同的就是从哪个位置开始绘制图片。
4. 在每个页面头尾绘制空白区域，将多余的进行遮挡。


  ```html
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>

<body>
  <div id="id" style="background-color: red; color: wheat;font-size: 30px;">
    <div data-item="true">123</div>
    <div data-item="true">123</div>
    <div data-item="true" >123</div>
    <div data-item="true" style="height: 500px;background-color: blue;">222</div>
    <div data-item="true" style="height: 500px;">222</div>
    <div data-item="true" style="height: 500px;background-color: blue;">222</div>
    <div data-item="true" style="height: 500px;">222</div>
  </div>
  <script>
    console.log(`output->jspdf`, jspdf)
    const A4_WIDTH = 592.28;
    const A4_HEIGHT = 841.89;
    const contentWidth = 550;
    const contentHeight = 800;
    const itemName = 'item'
    const groupName = 'group'
    const filename = '文件名.pdf'
    // 创建实例
    const pdf = new jspdf.jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'p',
    });
    let element = document.querySelector("#id")
    print()
    async function print() {
      const { width, height, data } = await toCanvas(element, contentWidth);
      const baseX = (A4_WIDTH - contentWidth) / 2;
      const baseY = (A4_HEIGHT - contentHeight) / 2;
      await outputWithAdaptive()
        // 获取htmlh转canvas的图片信息
    async function toCanvas(element, width) {
      const canvas = await html2canvas(element);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const height = (width / canvasWidth) * canvasHeight;
      const canvasData = canvas.toDataURL('image/jpeg', 1.0);
      return { width, height, data: canvasData };
    };
    function addBlank (x, y, width, height) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x, y, Math.ceil(width), Math.ceil(height), 'F');
    };
    //自适应绘制多页
    async function outputWithAdaptive() {
      const splitElement = () => {
        const res = [];
        let pos = 0;
        const elementWidth = element.offsetWidth;
        //更新坐标
        function updatePos(height) {
          if (pos + height <= contentHeight) {
            pos += height;
            return;
          }
          res.push(pos);
          pos = height;
        }
        //遍历节点 计算块节点item的高度，便于后续是否这块能在一页内显示
        function traversingNodes(nodes) {
          if (nodes.length === 0) return;
          nodes.forEach((one) => {
            if (one.nodeType !== 1) return;
            // 指定要一块显示的dom 如 <div :data-item="true">...</div>
            const { [itemName]: item, [groupName]: group } = one.dataset;
            if (item != null) {
              const { offsetHeight } = one;
              updatePos(contentWidth / elementWidth * offsetHeight);
            } else if (group != null) {
              traversingNodes(one.childNodes);
            }
          });
        }
        traversingNodes(element.childNodes);
        res.push(pos);
        return res;
      };
      const elements = splitElement();
      let accumulationHeight = 0;
      let currentPage = 0;
      // 开始绘制
      for await (const elementHeight of elements) {
        const isLast = currentPage === elements.length - 1;
        // addImage(baseX, baseY - accumulationHeight);
        pdf.addImage(data, 'JPEG', baseX, baseY - accumulationHeight, width, height);
        accumulationHeight += elementHeight;
        // 绘制白色矩形，覆盖当前页面多余的边
        addBlank(0, 0, A4_WIDTH, baseY);
        addBlank(0, baseY + elementHeight, A4_WIDTH, A4_HEIGHT - (baseY + elementHeight));
        if (!isLast) {
          pdf.addPage();
        }
        currentPage++;
      }
      pdf.save(filename);
    }
    }

  </script>
</body>

</html>
  ```

  ## 方案二
  
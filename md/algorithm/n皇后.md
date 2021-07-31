# n 皇后

    皇后，是国际象棋中的棋子，意味着国王的妻子。皇后只做一件事，那就是“吃子”。当她遇见可以吃的棋子时，就迅速冲上去吃掉棋子。当然，她横、竖、斜都可走一到七步，可进可退。（引用自 百度百科 - 皇后 ）
    /**
    * @param {number} n
    * @return {string[][]}
    */
    var solveNQueens = function(n) {

    };

## 方案- 

+ 回溯法思路

```javascript
   var solveNQueens = function(n) {
  let res = []
  dfs(n, [], res)
  return res
}

/**
 * 递归计算 N 皇后的解
 * @param {number} n
 * @param {number[]} tmp 长度为 n 的数组，tmp[i] 代表第 i 行的皇后放置的位置
 * @param {string[]} res
 */
function dfs(n, tmp, res) {
  // 如果 tmp 长度为 n，代表所有皇后放置完毕
  if (tmp.length === n) {
    // 把这种解记录下来
    res.push(
      tmp.map(i => {
        let strArr = Array(n).fill('.')
        strArr.splice(i, 1, 'Q')
        return strArr.join('')
      })
    )
    return
  }
  // 每次有 n 个选择，该次放置在第几列
  for (let j = 0; j < n; j++) {
    // 如果当前列满足条件
    if (isValid(tmp, j)) {
      // 记录当前选择
      tmp.push(j)
      // 继续下一次的递归
      dfs(n, tmp, res)
      // 撤销当前选择
      tmp.pop()
    }
  }
}

function isValid(tmp, j) {
  let i = tmp.length
  for (let x = 0; x < i; x++) {
    let y = tmp[x]
    if (y === j || x - y === i - j || x + y === i + j) {
      return false
    }
  }
  return true
}
```
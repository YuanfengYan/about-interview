1. 分支管理：
  - 主要分支：
    - master分支：用于生产环境，稳定的代码应该合并到该分支。
    - develop分支：用于开发环境，各个功能开发完成后应合并到该分支。
  - 特性分支：
    - 命名规范：feature/<功能描述>。
    - 每个功能或任务应该在独立的特性分支上进行开发。
    - 完成功能后，将特性分支合并到develop分支。
2. 提交规范：
  - 提交前先执行git status确保只提交所需的文件。
  - 使用清晰、简明的提交消息，解释所做的更改。
  - 使用动词的现在时态，如"Fix bug"，"Add feature"等。
3. 合并请求（Pull Requests）：
  - 在开始工作之前，先创建一个新的特性分支。
  - 完成特性开发后，将特性分支推送到远程仓库，并创建一个合并请求。
  - 请求合并到develop分支之前，确保代码通过了所有测试，并且没有冲突。
  - 请求合并之前，至少需要一个同事进行代码审查。
4. 更新与同步：
  - 在开始新工作之前，从远程仓库拉取最新代码并合并到本地分支。
  - 在提交代码之前，确保已经将最新的更改合并到本地分支。
5. 版本标签：
  - 在每个重要的里程碑或发布时，创建一个版本标签。
  - 标签命名规范：v<版本号>，如v1.0.0。
  - 标签使得代码更易于识别和跟踪。
6. 忽略文件：
  - 在项目根目录下创建.gitignore文件，并列出不应包含在版本控制中的文件和文件夹。
7. 提交频率：
  - 经常提交代码，而不是等到任务完成后再提交。
  - 小而频繁的提交可以使代码更易于管理和回滚。

## rebase
  主分支：develop    自己的开发分支：zc-develop

1. 在自己分支下开发  + 新文件
2. git add .   
3. git commit -m 'add: xxxxxx你做了些什么'
4. git fetch origin develop:develop   拉取远端的develop到本地develop
=== 特殊情况：本地有代码不提交到远端 需要暂存
1. git add 
2. git stash 
=== 
5. git rebase develop  用自己分支(zc-develop)向develop变基
==== 特殊情况
--出现冲突
1. 解决冲突 
2. git add . 冲突的文件
3. git rebase --continue
4. 出现需要修改的合并记录 ZZ（大写）或者:wq! 退出 
==== 
6. git checkout develop
7. git merge zc-develop 
8. git push origin develop 
9. git checkout zc-develop 回到自己分支继续开发
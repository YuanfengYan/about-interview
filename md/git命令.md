# git

## 一、配置 Git 的相关参数

1. 仓库级的配置文件：在仓库的 .git/.gitconfig，该配置文件只对所在的仓库有效。
2. 全局配置文件：Mac 系统在 ~/.gitconfig，Windows 系统在 C:\Users\<用户名>\.gitconfig。
3. 系统级的配置文件：在 Git 的安装目录下（Mac 系统下安装目录在 /usr/local/git）的 etc 文件夹中的 gitconfig。

```
# 查看配置信息
# --local：仓库级，--global：全局级，--system：系统级
$ git config <--local | --global | --system> -l

# 查看当前生效的配置信息
$ git config -l

# 编辑配置文件
# --local：仓库级，--global：全局级，--system：系统级
$ git config <--local | --global | --system> -e

# 添加配置项
# --local：仓库级，--global：全局级，--system：系统级
$ git config <--local | --global | --system> --add <name> <value>

# 获取配置项
$ git config <--local | --global | --system> --get <name>

# 删除配置项
$ git config <--local | --global | --system> --unset <name>

# 配置提交记录中的用户信息
$ git config --global user.name <用户名>
$ git config --global user.email <邮箱地址>

# 更改Git缓存区的大小
# 如果提交的内容较大，默认缓存较小，提交会失败
# 缓存大小单位：B，例如：524288000（500MB）
$ git config --global http.postBuffer <缓存大小>

# 调用 git status/git diff 命令时以高亮或彩色方式显示改动状态
$ git config --global color.ui true

# 配置可以缓存密码，默认缓存时间15分钟
$ git config --global credential.helper cache

# 配置密码的缓存时间
# 缓存时间单位：秒
$ git config --global credential.helper 'cache --timeout=<缓存时间>'

# 配置长期存储密码
$ git config --global credential.helper store

```

## 二、git 相关常规操作

1. git pull --rebase 等价于sourceTree中的衍合，基变
    等价于 ① git fetch origin  ② git rebase origin/master

    - 遇到冲突时
        0、 git pull --rebase
         1、使用git add或git rm将文件标记为添加
         2、 git commit -m "本次提交描述"
         3、 git pull --rebase
         4、 git add .  
         5、 git rebase --continue
         6、 git push

2. git pull
    默认等价于 ① git fetch origin ② git merge origin/master

3、 git rebase - 分支名 （sourceTree）


## git 撤销，放弃本地修改，放弃已提交修改

1. 未使用 git add 缓存代码时

    - git checkout .
        放弃所有未暂存的文件修改（除新增的文件）  

2. 已经使用了 git add 暂存了的代码（相当于撤销 git add 命令所在的工作）

    - git reset HEAD filepathname
        git reset HEAD filepathname （比如： git reset HEAD readme.md）来放弃指定文件的缓存
    - git reset HEAD .  
        放弃所有的暂存

3. 已经用 git commit 提交了代码。

    - git reset --hard HEAD^
        回退到上一次commit的状态
    - git reset --hard commitid (git log 拿到提交历史的commitid) 类似于sourcetree 的重置的到某次提交
        回退到任意版本
    - git reset HEAD~ （适用于commit提交错分支，但未推送时，可以将提交的代码撤销重新回到为暂存列表中）
        撤销刚刚提交的就又回到本地的local changes 列表中。

## 将某分支某一次的提交合并到另一分支 git cherry-pick commitid

1. 首先，切换到develop分支，敲 git log 命令，查找需要合并的commit记录，比如commitID：7fcb3defff

2. 然后，切换到master分支，使用 git cherry-pick 7fcb3defff  命令，就把该条commit记录合并到了master分支，这只是在本地合并到了master分支

3. 最后，git push 提交到master远程（可以用命令也可以用工具的push操作），至此，就把develop分支的这条commit所涉及的更改合并到了master分支。

## git checkout 

    git checkout <分支名> 分支切换
    git branch -v：查看所有分支
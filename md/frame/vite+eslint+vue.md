# 项目搭建过程介绍 vite + eslint + vue-ts

## 一、 项目创建

1. `pnpm create vite my-vue-ts-app --template vue-ts`
2. `pnpm i`
3. `pnpm run dev`

- 使用vite 可以创建多中模板 `vanilla，vanilla-ts, vue, vue-ts，react，react-ts，react-swc，react-swc-ts，preact，preact-ts，lit，lit-ts，svelte，svelte-ts。`

- 相比于vue官网推荐的 `npm init vue@latest` 创建会少Router ，Pinia，Vitest， ESLint，Prettier等配置推荐

## 二、 配置eslint + .vscode/setting.json

1. `npm i eslint -D`
2. `touch .eslintrc.cjs` //根目录创建`.eslintrc.cjs`文件
3. 配置`.eslintrc.cjs`文件

```javascript
// 安装antfu写的一个eslint 配置文件。也可以使用其他的 npm i @antfu/eslint-config 
module.exports = {
  root: true,
  extends: ['@antfu'],
}

```

4. 配置 `.vscode/settings.json` 文件

```javascript
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true  //保存后用eslint的格式进行格式
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "json",
    "jsonc",
    "json5",
    "yaml",
    "yml",
    "markdown"
  ],
  "cSpell.words": [ //对于拼写的单词不是正确的英文单词，但又是需要显示的进行
    "antfu",
    "Vite"
  ],
  "nuxt.isNuxtApp": false
}

```

+ 不使用 Prettier + Eslint 原因可以参考 [antfu-为什么我不用Prettier](https://antfu.me/posts/why-not-prettier)
+ 需要研究eslint具体配置可以参考
  + [npm-antfu/eslint-config](https://www.npmjs.com/package/@antfu/eslint-config?activeTab=readme)
  + [ESlint配置大全](https://blog.csdn.net/lyy112987/article/details/121733450)
  + [Eslint官方文档](https://eslint.org/docs/latest/use/configure/configuration-files#)

## 三、配置commit提交校验 lint-staged + husky

lint-staged 它能让这些插件只扫描暂存区的文件而不是全盘扫描

1. `pnpm i lint-staged -D`
2. `package.json` 新增选项

```javascript
  "scripts": {
    ...
     "lint:fix": "eslint . --fix"
  },
  // "lint-staged": {
  //   "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
  //     "eslint --fix"
  //   ]
  // },
  "lint-staged": {
    "*.{ts,tsx,vue}": [
      "pnpm lint:fix"
    ]
  }

```

husky 它能够让我们轻松的使用git的钩子 如常用的 `pre-push、pre-commit`

1. `pnpm i husky -D`  `npx husky install` `npx husky add .husky/pre-commit` //下载初始化 husky 并新增 pre-commit 钩子文件
2. 配置`.husky/pre-commit` 在提交前执行对于的检查

```javascript
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "hello"

npx lint-staged  
```

+ 强制跳过 eslint 校验的git commit 命令 'git commit -m 'ccc' --no-verify'

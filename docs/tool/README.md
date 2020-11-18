# 从零开始搭建一个个人博客

## 初始化项目

1、创建并进入一个新目录

     mkdir vuepress-starter && cd vuepress-starter

2、使用包管理器进行初始化

    yarn init 或 npm init

> 注意：如果使用 npm 来安装, Node.js 版本需要 >=8 才可以

3、VuePress 安装为本地依赖

    yarn add -D vuepress 或 npm install -D vuepress

> 注意：如果你的现有项目依赖了 webpack 3.x，推荐使用 Yarn 而不是 npm 来安装 VuePress。因为在这种情形下，npm 会生成错误的依赖树。

初始化完成后, 会创建一个 package.json

```json
{
    "name": "yxblog",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "yx",
    "license": "ISC"
}
```

在 package.json 中, 配置启动命令

```json
"scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }

```

4、创建 docs 目录, 在 docs 新建一个 README.md，里面内容为 `# Hello VuePress`

```
 mkdir docs

 echo '# Hello VuePress' > docs/README.md
```

5、启动项目:

```
  yarn dev 或 npm run dev
```

VuePress 会在 http://localhost:8080 (opens new window)启动一个热重载的开发服务器

> 问题：本地开发模式运行 Vuepress 时，浏览器不能自动更新

> 解决方法：
> 在 package.json 中将运行命令 由

```json
  "dev": "vuepress dev docs"
  改为
  "dev": "vuepress dev docs --temp .temp"
```

运行 vuepress 会生成一个临时文件夹 .temp，可以在 .gitignore 中忽略掉该文件夹：

```
# vuepress temp file
.temp
```

6、打包项目:

```
  npm run build
```

嘻嘻，项目大体架子已经搭建出来了

> 注意：如果是命令行创建的 README.md 文件，编码可能会出现问题，我目前也没找到啥好的解决方式，删除重新建了一个就可以了

## 基本配置

1、在 docs 文件夹中创建.vuepress 文件夹

```
cd docs
mkdir .vuepress
```

.vuepress 主要就是放 vuepress 相关的配置

2、新建一个总的配置文件 config.js, 这个文件的名字是固定的

```js
module.exports = {
    title: 'Sunglow的博客',
    description:
        '分享Web前端相关的技术文章、工具资源、精选课程、最新资讯、原创内容',
}
```

生成的目录应该是这样的

```
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

npm run dev，你会看到一个页面，它包含一个页头，里面包含一个标题和一个搜索框。VuePress 内置了基于 headers 的搜索 —— 它会自动为所有页面的标题、h2 和 h3 构建起一个简单的搜索索引。

3、公共文件

有时可能需要提供一个静态资源，但是它们并不直接被你的任何一个 markdown 文件或者主题组件引用 —— 举例来说，favicons 和 PWA 的图标，在这种情形下，你可以将它们放在 .vuepress/public 中， 它们最终会被复制到生成的静态文件夹中。

```
.
├─ docs
│  ├─ README.md  //这个将会是我们以后的首页
│  └─ .vuepress // 这个里面会存放一些配置和组建
│     ├─ config.js  //配置文件，我们以后的所有配置基本都在这里写
│     └─ public //静态文件存放地
│        └─ home.jpg
└─ package.json
```

## 默认主题配置

### 设置封面页

```
---
home: true
heroImage: /home.jpg
heroText: Sunglow
tagline: Hero
actionText: 开始阅读 →
actionLink: /zh/guide/
features:
    - title: 简洁至上
      details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
    - title: Vue驱动
      details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
    - title: 高性能
      details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You

---
```

> 可以将相应的内容设置为 null 来禁用标题和副标题。

### 设置导航栏

导航栏可能包含你的页面标题、搜索框、 导航栏链接、多语言切换、仓库链接，它们均取决于你的配置。

1、导航栏 Logo

你可以通过 themeConfig.logo 增加导航栏 Logo ，Logo 可以被放置在公共文件目录：

```js
// .vuepress/config.js
module.exports = {
    themeConfig: {
        logo: '/assets/img/logo.png',
    },
}
```

2、导航栏链接

可以通过 themeConfig.nav 增加一些导航栏链接:

```js
module.exports = {
    themeConfig: {
        themeConfig: {
            logo: '/assets/img/logo.png',
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Node', link: '/node/' },
            { text: 'External', link: 'https://google.com' },
        ],
    },
}
```

` 外部链接 <a> 标签的特性将默认包含 target="\_blank" rel="noopener noreferrer"，你可以提供 target 与 rel，它们将被作为特性被增加到 <a> 标签上：`

```js
{ text: 'External', link: 'https://google.com', target:'_self', rel:'' },
```

效果如图所示：

如果想要展示二级导航, 可以这样配置:

```js
module.exports = {
    themeConfig: {
        nav: [
            {
                text: 'Languages',
                ariaLabel: 'Language Menu',
                items: [
                    { text: 'Chinese', link: '/language/chinese/' },
                    { text: 'Japanese', link: '/language/japanese/' },
                ],
            },
        ],
    },
}
```

效果如图所示：

3、禁用导航栏

你可以使用 themeConfig.navbar 来禁用所有页面的导航栏：

```js
module.exports = {
    themeConfig: {
        navbar: false,
    },
}
```

你也可以通过 YAML front matter 来禁用某个指定页面的导航栏：

```
---
navbar: false
---
```

### 侧边栏配置

1、自动获取侧边栏内容

自动生成当前页面标题的侧边栏, 可以在 config.js 中配置来启用

```js
module.exports = {
    themeConfig: {
        sidebar: 'auto', // 侧边栏配置
        sidebarDepth: 2, // 侧边栏显示2级
    },
}
```

在 多语言 模式下, 你也可以将其应用到某一特定的语言下：

```js
module.exports = {
    themeConfig: {
        '/zh/': {
            sidebar: 'auto',
        },
    },
}
```

2、展示每个页面的侧边栏(多个侧边栏)

如果希望为不同的页面组显示不同的侧边栏, 点击指南显示的是对应的侧边栏,则可以做如下设置：

```js
module.exports = {
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Node', link: '/node/' },
            {
                text: '前端',
                items: [
                    { text: 'html', link: '/web/html/' },
                    { text: 'css', link: '/web/css/' },
                ],
            }
        ],
        sidebar: {
            '/node/': [
                ['', 'node目录'] /* /node/ */,
                ['express', 'node框架'] /* /node/express.html */,
            ],
            '/web/': [
                ['', '前端'], //没有子级的时候可以这样写
                {
                    title: 'css',
                    name: 'css',
                    collabsable: true,
                    sidebarDepth: 1, // 可选的, 默认值是 1
                    children: [
                        ['css/', '目录'],
                        ['css/one', 'css常考面试题'],
                    ],
                },
                {
                    title: 'html',
                    name: 'html',
                    collabsable: false,
                    children: [['html/', 'html内容']],
                },
            ]
        },
    },
}

```
上面采用了两个方式配置侧边栏

1、侧边栏是node目录下直接是写的markdown文章

2、而在web下又有多个分类, 分类又进行了分栏配置

具体的细节可以详细参考 [VuePress 官网 默认主题配置](https://www.vuepress.cn/theme/default-theme-config.html)

## 部署到GitHub

新建仓库一： username.github.io （不用克隆到本地）

> username是自己的github的账号名

如下图所示：




仓库建好后，不用克隆到本地，内容更新修改都在下面的仓库中进行。

新建仓库二：yxBlog克隆到本地，

用来开发博客的，以后只需要改这个项目就可以了  

> docs/.vuepress/config.js 中配置 对应仓库名 Wiki1001Pro
  base: '/yxBlog/'// 这是部署到github相关的配置

1、在根目录下创建deploy.sh文件，文件内容如下：

```bash
#!/usr/bin/env sh

# 自动部署脚本  
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.yourwebsite.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果你想要部署到 https://USERNAME.github.io
git push -f git@github.com:USERNAME/USERNAME.github.io.git master

# 如果发布到 https://USERNAME.github.io/<REPO>  REPO=github上的项目
# git push -f git@github.com:USERNAME/<REPO>.git master:gh-pages

```

2、在package.json文件里添加如下命令：

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vuepress dev docs --temp .temp",
    "build": "vuepress build docs",
    "deploy": "bash deploy.sh"
  }
  ```


  3、执行deploy.sh里的脚本，然后运行如下命令则部署成功

  ```bash
    npm run deploy

  ```
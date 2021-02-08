### 可视化编辑器

## 技术框架采用Vue3 + Typescript + ElementPlus

[预览地址](http://martsforever-pot.gitee.io/vue-visual-editor/)

实现效果如下：

![预览2](./images/2.png)

![预览1](./images/1.png)


创建工程

1、安装脚手架
全局安装过旧版本的 vue-cli(1.x 或 2.x)要先卸载它，否则跳过此步：

npm uninstall -g vue-cli

安装@vue/cli（Vue CLI 3的包名称由 vue-cli 改成了 @vue/cli）
 cnpm install -g @vue/cli //yarn global add @vue/cli


2、vue create  visual-editor






发现创建的时候会报错  错误提示如下
ERROR  command failed: npm install --loglevel error --registry


一、出现这个错误，首先需要排除，node，npm的版本问题。
二、然后尝试清除npm缓存：
npm cache clean --force
三、关键方法：使用这个方法解决，GitHub上大拿们给的方法：
解答1："useTaobaoRegistry"原先是false，将其设置为true。
解答2：文件，~/.vuerc的位置：


3、启动项目





问题：
1、vue cli 3.0 windows上下箭失效解决方案
vue create  visual-editor改为
winpty vue.cmd create  visual-editor

这时候将***vue create 项目名***这个指令改为 winpty vue.cmd create 项目名 即可。
或者：
选择git bash 的安装目录，找到Git/etc/bash.bashrc文件
文件末尾添加 ：
alias vue='winpty vue.cmd'
关闭所有git bash，在重新打开既可

2、Vue CLI 3 和旧版使用了相同的 vue 命令，所以 Vue CLI 2 (vue-cli) 被覆盖了。如果你仍然需要使用旧版本的 vue init 功能，你可以全局安装一个桥接工具：
npm install -g @vue/cli-init

//安装完后 就还可以使用 vue init 命令
vue init webpack my_project
vue --version



npm 遇到问题

https://blog.csdn.net/weixin_43336281/article/details/107064733

项目依赖安装：
cnpm i element-plus -S


项目错误提示：
  error  Unnecessary semicolon  no-extra-semi


如果希望 eslint 不检查分号这一项，在项目根目录下找到.eslintrc.js文件，为rules 属性新增配置：
'semi': 0


特别说明：
如果我们希望在每个 js 代码每一个表达式的结尾都以分号结尾，则在 rules 字段增加配置： ‘semi’: [“error”, “always”] ，否则 eslint 会给出错误提示。





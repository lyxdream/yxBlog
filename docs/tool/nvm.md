**nvm的安装及使用**


**详情可以查看我的csdn相关文章 [nvm的安装及使用](https://blog.csdn.net/lyxgoodLucky/article/details/94567949?spm=1001.2014.3001.5501)**

及node高版本npm无法使用的解决方案

nvm作用：同一台电脑安装和切换不同版本的node。

 1. **第一步：下载nvm**
        nvm 的下载地址：[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) 
        ![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703144238353.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)    	nvm-noinstall.zip： 免安装版本，但是使用之前需要配置
		nvm-setup.zip：一个安装包，下载之后点击安装，无需配置
		Source code(zip)：zip压缩的源码
		Sourc code(tar.gz)：tar.gz的源码，一般用于*nix系统
      
 2. **安装**
      点击nvm-setup.zip安装
       ![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703144337844.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70) 
      根据提示点击下一步，下一步，勾选安装路径完成安装即可
      输入nvm -v 检测nvm是否安装成功，如果出现如下提示则说明nvm安装成功
      可以看到nvm版本号和一系列帮助指令；![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703144801468.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
      否则，可能会提示nvm: command not found
 3. **修改settings.txt**
 	在安装目录下找到settings.txt文件![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703145018205.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
 打开settings.txt加上：
node_mirror: http://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/

  

```
   root: D:\softWare\nvm 
    path: D:\softWare\nodejs 
    arch: 64 
    proxy: none
    node_mirror: http://npm.taobao.org/mirrors/node/
    npm_mirror: https://npm.taobao.org/mirrors/npm/
```

 
 4. **使用**
 `nvm install 版本号` 安装指定的版本的nodejs
 例如：
    nvm install 8.8.0
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703152912565.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2x5eGdvb2RMdWNreQ==,size_16,color_FFFFFF,t_70)
 `nvm use 版本号` 使用指定版本的nodejs
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703152932818.png)

  `nvm ls` 查看已经安装的node版本
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/2019070315300567.png)

注意：有些人有可能下载nvm之后使用nvm install 6.12.0，发现node -v和npm -v都能使用
但是下载8.8.0，10.15.3这些版本，npm不能使用
解决办法：
下载一个node高本版的安装包，安装一下，安装完成之后，发现npm可以使用了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703153222215.png)
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20190703153514245.png)


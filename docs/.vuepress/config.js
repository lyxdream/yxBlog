module.exports = {
    title: '前端成长指引',
    description:
        // '从前端基础到前端框架使用及其源码解读,再到Node.js,和我一起规划你的前端成长之路',
        '从前端基础到前端框架使用及其源码解读,再到Node.js，我们一起升级打怪，一起开启进阶之路',
    base: '', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true, // 代码块显示行号
    },
    head: [
        ['link', { rel: 'icon', href: '/img/favicon.ico' }], // 标签栏里的头像
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
    plugins: [
        '@vuepress/pwa',
        {
            serviceWorker: true,
            updatePopup: true,
            '@vuepress/back-to-top': true,
        },
    ],
    themeConfig: {
        //这里的/指向的是docs/.vuepress/public目录
        logo: '/img/home.jpg', //配置导航logo
        navbar: true, //是否禁用导航栏
        displayAllHeaders: false, // 默认值：false  true显示所有页面的标题链接
        activeHeaderLinks: true, // 活动的标题链接是否禁用 默认值：true
        // sidebar: 'auto',//自动生成当前页面标题的侧边栏
        sidebarDepth: 3, // 侧边栏显示2级
        nav: [
            { text: '主页', link: '/' },
            { text: '工具', link: '/tool/',sidebarDepth: 2 },
            {
                text: 'HTML+CSS+JS',
                link: '/web/',
            },
            { text: 'TypeScript', link: '/typescript/' },
            {
                text: '前端主流框架',
                items: [
                    { text: 'Vue', link: '/frame/vue/' },
                    { text: 'React', link: '/frame/react/' },
                ],
            },
            { text: '小程序', link: '/mini/' },
            { text: 'Webpack', link: '/webpack/' },
            { text: 'Nodejs', link: '/node/' },
            { text: '设计模式', link: '/designPattern/' },
            { text: '算法', link: '/algorithm/' },
            { text: '面试问题', link: '/interview/' },
            { text: '关于我', link: '/about/' },
            {
                text: 'GitHub',
                link: 'https://github.com/lyxdream/lyxdream.github.io',
            },
        ],
        sidebar: {
            '/tool/': [
                ['', '目录'],
                ['describeBlog', 'VuePress搭建个人博客'],
                [
                    'crawler',
                    ' axios + cheerio + node-xlsx 爬取并导出到excel表格',
                ],
                ['gitCommit', 'git commit规范'],
                ['nvm', 'nvm的安装和使用'],
                ['vscode', 'vscode 代码格式化'],
                ['buryingPoint', '埋点'],
                ['thirdPartyLogin', '第三方登录']
            ],
            '/web/': [
                ['', '目录'], //没有子级的时候可以这样写
                {
                    title: 'html',
                    name: 'html',
                    collabsable: true,
                    children: [
                        ['html/', '目录']
                    ],
                },
                {
                    title: 'css',
                    name: 'css',
                    collabsable: true,
                    children: [
                        ['css/', '目录'],
                        ['css/margin', 'margin折叠'],
                        ['css/compatible', 'css兼容问题'],
                        ['css/clear', '清除浮动']     
                ],
                },
                {
                    title: 'javascript',
                    name: 'javascript',
                    collabsable: true,
                    children: [
                        ['javascript/', '目录'],
                        ['javascript/higherFunction', '高阶函数'],
                        ['javascript/currying', '函数柯里化 和函数反柯里化'],
                        ['javascript/typeDetection', '类型检测'],
                        ['javascript/dataConversion', '数据类型转换'],
                        ['javascript/event', 'js中事件冒泡和事件捕获'],
                        ['javascript/arguments', 'arguments'],
                        
                    ],
                },
                {
                    title: 'es6',
                    name: 'es6',
                    collabsable: true,
                    children: [
                        ['es6/', '目录'],
                        ['es6/promise', 'promise手写系列'],
                        ['es6/asynchronous', 'generator => async + await'],
                    ],
                },
            ],
            '/typescript/': [['', '目录']],
            '/frame/': [
                ['', '目录'], //没有子级的时候可以这样写
                {
                    title: 'vue',
                    name: 'vue',
                    collabsable: true,
                    children: [
                        ['vue/', '目录'],
                        ['vue/source','Vue2源码解析']
                ],
                },
                {
                    title: 'react',
                    name: 'react',
                    collabsable: true,
                    children: [['react/', '目录']],
                },
            ],
            '/mini/': [
                ['', '目录'],
                ['/mini/getLocation', '小程序(授权)获取当前位置'],
                [
                    '/mini/input',
                    'input内容过长，失去焦点的时候，内容显示不全的',
                ],
                ['/mini/camera', '人脸采集 - 拍照上传校验'],
                ['/mini/h5ToMini', '小程序和H5互跳以及小程序跳转小程序'],
                ['/mini/openLocation', '使用wx.openLocation遇到的坑'],
            ],

            '/webpack/': [['', '目录']],
            '/node/': [
                ['', 'node目录'] /* /node/ */,
                ['what', 'Node基本概念'] /* /node/express.html */,
            ],
            '/designPattern/': [['', '目录']],
            '/algorithm/': [
                ['', '目录'],
                ['/algorithm/tree','树'],
                ['/algorithm/LinkedList','链表']
          ],
            '/interview/': [
                ['', '目录'],
                ['dataTypeConversion','数据类型转换'],
                ['eventRing', '浏览器事件环'],
                ['commonQuestions','常见面试题'] 
            ],
            '/about/': [['', '关于我']],
        },
    },
}

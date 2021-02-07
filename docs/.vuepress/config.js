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
        },
    ],
    themeConfig: {
        //这里的/指向的是docs/.vuepress/public目录
        logo: '/img/home.jpg', //配置导航logo
        navbar: true, //是否禁用导航栏
        displayAllHeaders: false, // 默认值：false  true显示所有页面的标题链接
        activeHeaderLinks: true, // 活动的标题链接是否禁用 默认值：true
        // sidebar: 'auto',//自动生成当前页面标题的侧边栏
        // sidebarDepth: 2, // 侧边栏显示2级
        nav: [
            { text: '主页', link: '/' },
            { text: '工具', link: '/tool/' },
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
            { text: '设计模式', link: '/algorithm/' },
            { text: '算法', link: '/algorithm/' },
            { text: '面试问题', link: '/interview/' },
            { text: '关于我', link: '/introduce/' },
            {
                text: 'GitHub',
                link: 'https://github.com/lyxdream/lyxdream.github.io',
            },
        ],
        sidebar: {
            '/tool/': [
                ['', '目录'],
                ['describeBlog', 'VuePress搭建个人博客'],
            ],
            '/web/': [
                ['', '目录'], //没有子级的时候可以这样写
                {
                    title: 'html',
                    name: 'html',
                    collabsable: true,
                    children: [
                        ['html/', '目录'],
                        ['html/test', 'test'],
                    ],
                },
                {
                    title: 'css',
                    name: 'css',
                    collabsable: true,
                    children: [['css/', '目录']],
                },
                {
                    title: 'javascript',
                    name: 'javascript',
                    collabsable: true,
                    children: [['javascript/', '目录']],
                },
                {
                    title: 'es6',
                    name: 'es6',
                    collabsable: true,
                    children: [['es6/', '目录']],
                },
            ],
            '/typescript/': [['', '目录']],
            '/frame/vue/': [['', '目录']],
            '/frame/react/': [['', '目录']],
            '/node/': [
                ['', 'node目录'] /* /node/ */,
                ['express', 'node框架'] /* /node/express.html */,
            ],
            '/interview/': [['', '常见问题']],
        },
    },
}

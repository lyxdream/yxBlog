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
            { text: 'Home', link: '/' },
            {
                text: '前端',
                items: [
                    { text: 'css', link: '/web/css/' },
                    { text: 'js', link: '/web/js/' },
                    { text: 'js', link: '/web/ts/' },
                ],
            },
            { text: 'Node', link: '/node/' },
            { text: '工具', link: '/tool/' },
            { text: '面试问题', link: '/interview/' },
            {
                text: 'Languages',
                ariaLabel: 'Language Menu',
                items: [
                    { text: 'Chinese', link: '/language/chinese/' },
                    { text: 'English', link: '/language/English/' },
                ],
            },
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
                    title: 'js',
                    name: 'js',
                    collabsable: false,
                    children: [['js/', 'js基础']],
                },
                {
                    title: 'ts',
                    name: 'ts',
                    collabsable: false,
                    children: [['ts/', 'ts']],
                },
            ],
            '/interview/': [['', '常见问题']],
            '/tool/': [['', 'VuePress搭建个人博客']],
        },
    },
}

import { defineConfig } from 'vitepress'

export default defineConfig({
  // 标题（浏览器后缀）
  title: "FTT_T",
  // 描述
  description: "FTT_T Blog",
  // 语言
  lang: 'zh-CN',
  // 根目录，如果需要部署成htpps://github.com/blog/的形式，则设置/blog/
  base: '/',
  // 文档最后更新时间展示
  lastUpdated: true,
  // 去除浏览器链接中的.html后缀
  cleanUrls: true,
  // markdown显示行数
  markdown: {
    lineNumbers: true,
  },
  // head设置
  head: [
    // 浏览器中图标
    ["link", {rel: "icon", href: "/logo.ico"}],
    // 添加百度统计代码
    ['script', {},
    `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?自己申请";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `
    ]
  ],
  // 主题设置
  themeConfig: {
    // 左上角logo
    logo: '/logo.png',
    // 首页右上角导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/aboutme' }
    ],
    // 文章左侧导航栏
    sidebar: [
      { text: 'AboutMe', link: '/aboutme' },
      {
        text: '博客',
        items: [
          {
            text: '2025',
            items: [
              { text: 'codex', link: '/blog/codex' },
              { text: 'claude', link: '/blog/claude' },
              { text: '你好2025', link: '/blog/你好2025' },
            ]
          },
          {
            text: '2024',
            items: [
              { text: '从自行车到gps', link: '/blog/从自行车到gps' },
              { text: '麦轮', link: '/blog/麦轮' },
              { text: '你好2024', link: '/blog/你好2024' },
            ]
          },
          {
            text: '2023',
            items: [
              { text: 'android开发常用命令', link: '/blog/android开发常用命令' },
              { text: 'ubuntu自定义脚本', link: '/blog/ubuntu自定义脚本' },
              { text: 'VitePress博客搭建', link: '/blog/VitePress博客搭建' },
            ]
          },
        ]
      }
    ],
    // 文章底部导航栏的自定义配置，默认是英语
    docFooter: {
			prev: '上一篇',
			next: '下一篇',
		},
    // 文章右侧目录展示级别和标题
    outline: {
      level: [2, 6],
      label: '文章目录'
    },
    // 文章更新时间的前缀文本
    lastUpdatedText: '最后更新时间',
    // 开启本地搜索（左上角）
    search: {
      provider: 'local',
    },
    // 右上角Github链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/deconftt' }
    ],
    // 页脚
    footer: {
			copyright: 'Copyright © 2023-present FTT_T <br><a href="https://beian.mps.gov.cn/#/query/webSearch?code=33028302000652" rel="noreferrer" target="_blank" style="text-decoration: none;">  <span style="background-image: url(/blog/assets/beian.png);background-position: left;background-repeat:no-repeat;background-size:16px 16px;color:#939393;font-size:12px;vertical-align:middle;padding-left: 20px;">浙公网安备33028302000652号</span></a>  <br> <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" style="text-decoration: none;"> <span style="color:#939393;font-size:12px;vertical-align:middle;">浙ICP备2024084869号</span></a> ' ,
		}

  }
})
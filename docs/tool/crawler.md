# 使用 axios + cheerio + node-xlsx 爬取并导出到excel表格(网页爬虫)

具体实现过程请查看我的github [网页爬虫](https://github.com/lyxdream/cheerio-test)

## 核心代码实现部分

```js
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
var fs = require('fs');
var path = require('path');
var config = require('./../config.js');
let counter = 0;  // 成功爬取的数据计数
var xlsx = require('node-xlsx');
let fileRoute = path.resolve(__dirname, config.rawDataFileName);
let fileName = path.resolve(__dirname, config.saveFileName);

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);
    /**
     *
     * @returns
     * @memberof ProductService
     */
    async getProduct() {
      const url = `http://quotes.money.163.com/f10/zycwzb_600519.html`;
      const res = await axios.get(url, {});
      const titleList = [];
      const dataList = [];
      const $ = cheerio.load(res.data);
      const title = $('.col_l tbody tr').eq(10).text();
      const head = $(".col_r table tbody tr.dbrow").eq(0).find('th');
      const cont = $('.col_r table tbody tr').eq(11).find('td');
    
      head.each(function(){
        titleList.push($(this).text())
        console.log(titleList)
      })
      cont.each(function(){
        dataList.push($(this).text())
        console.log(dataList)
      })
      this.saveFile({title,titleList,dataList});
    }
    // 转存文本
 saveFile(data) {
  data = [
    {
        name : '个股行情',
        data : [
          ['报告日期', ...data.titleList],
          [ data.title, ...data.dataList]
        ]
    }
]
    const buffer = xlsx.build(data);
    console.log(buffer)
      fs.writeFile('./out.xlsx', buffer, 'binary',function(err){
        if(err){
            console.log(err);
        }
      })
    }
  }

```

## 启动
```bash
npm run start:dev
```
打开localhost:3000刷新，会发现生成一个xlsx文件

## 功能
爬取 [网易财经](http://quotes.money.163.com/f10/zycwzb_600519.html)网页中，茅台酒的净利润(扣除非经常性损益后)(万元)，并保存到 out.xlsx 表格中。


##  实现原理
- axios 获取http://quotes.money.163.com/f10/zycwzb_600519.html 内容
- 返回内容是服务端渲染，数据和 dom 结构混合在一起，使用 cheerio 获取数据报告表格的 dom 片段
- 使用正则解析 dom 片段，过滤出有用数据
- 使用 node-xlsx 将数据写入 xlsx 文件
##  库
- nest 脚手架
- axios 发送 ajax 请求
- cheerio 类似 jquery，能够解析字符串形式的 dom
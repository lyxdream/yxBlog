### 清除浮动的三种方式：

### （1）使用伪元素来清除浮动

```css
父级div加：after和zoom
.clearfix:after{
    content:"";
    height:0;
    display:block;
    visibility:hidden;
    clear:both;
  }    
 .clearfix{
    zoom:1;   //为了兼容IE
 }
```

- 优点：大多数浏览器都支持。

- 缺点：代码多，原理难以理解。

### （2）使用额外标签法

```css
在浮动的盒子下再放一个空的div标签，在这个标签中使用clear:both,来清除浮动。
.clear{
    clear:both;
}

```

优点：简单，而且没有固定父级div的高度。

缺点：设置过多的空的div，使代码结构过于混乱

### （3）给浮动元素的父元素添加overflow属性来清除浮动

```css
先找到浮动盒子的父元素，再在父元素中添加一个属性，overflow:hidden;来清除浮动。
  .owh{
        overflow:hidden;
    }
```

原理：浏览器会自动浮动检查高度。

优点：简单，大多浏览器都支持

缺点：超出部分会被隐藏。
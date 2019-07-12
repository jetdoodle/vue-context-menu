# 说明

simple context-menu for Vue；  
简单的 vue 右键菜单插件。简单配置，快速使用，不失灵活性。
这个东西其实是自己项目用到的，单独分出来上传了 npm,作为依赖好管理一点。

<br>

## 引入方法

```JavaScript
import contextMenu from "@jetdoodle/vue-context-menu";   //引入功能
import "@jetdoodle/vue-context-menu/index.css";   //引入css样式或使用自己的样式
Vue.use(contextMenu);   //Vue调用
```

## 使用方法

1. 在 `html` 标签中插入 `v-rightMenu="yourMenu"` 属性，则激活右键菜单。yourMenu 是菜单的配置，例如：

```html
<div v-rightMenu="yourMenu"></div>
```

2. 配置菜单项的方法是在 data 中创建参数，然后在标签中绑定。配置菜单如下：

```JavaScript
 yourMenu:[
   {
        content: "菜单 1",                 //选项名 (必填)
        description:"描述 1",              //描述性文字，颜色较浅，会显示在菜单的下一行或右侧
        descriptionPosition:"right",       //right 时会让描述文字显示在选项名的右侧，如果没有此属性或值不为 right，则描述文字会显示在下一行
        title："您好~"                     //弹出提示
        callback: "methodsName"            //会根据 methodsName 字符串去调用当前 Vue 组件的 methods 中的方法
        disabled: true,                    //是否禁用该项(可以使用 boolean 或者判断式，如：1 > 0)
        disabledTitle: "您没有权限操作"     //禁用时显示的 title 提示
   },{
        content: "---",                    //选项名使用"---"可以形成一条分隔线
   },{
        content: "菜单 2",
        callback: ""
   },
   ...
]
```

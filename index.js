/**右键菜单
 * 【说明】
 * 
引入方法：
        import rightMenu from "@/rightmenu.js";   //引入文件
        Vue.use(rightMenu);   //在Vue中使用

使用方法：
        1. 在html标签中插入v-rightMenu="yourMenu"属性，则激活右键菜单。yourMenu是菜单的配置，例如：<div v-rightMenu="yourMenu" ></div>
        2. 配置菜单项的方法是在data中创建参数，然后在标签中绑定。配置菜单如下：
            yourMenu:[
                {
                    content: "菜单1",   //选项名  (必填)
                    description:"描述1",  //会显示在菜单的下面，颜色较浅的文字
                    descriptionPosition:"right",  //right时会让描述文字显示在选项名的右侧，如果没有此属性或值不为right，则描述文字会显示在下一行
                    title："您好~"  //菜单提示
                    callback: "methodsName"   //会根据methodsName字符串去调用当前Vue组件的methods中的方法
                    disabled: true,   //是否禁用该项(可以使用boolean 或者判断式，如：1 > 0)
                   disabledTitle:  "您没有权限操作"   //禁用时显示的title提示
                },
                {
                    content: "---",   //选项名使用"---"可以形成一条分隔线
                },
                {
                    content: "菜单1",
                    callback: ""
                },
            ]
 * 
 *
 */

export default {
  install: function(Vue) {
    var GLOBLEsize = 0;
    Vue.directive("rightMenu", {
      bind(el, binding, vnode) {
        let currentSize = GLOBLEsize;
        //增加一个遮罩层方便控制菜单显示时候取消其余事件
        var Maskstyle = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:99997;";
        if (document.getElementById("TT_MASK") == null) {
          //console.log("创建遮罩");
          var Mask = document.createElement("div");
          Mask.style = Maskstyle + "display:none";
          Mask.setAttribute("id", "TT_MASK");
          document.body.appendChild(Mask);
        }

        el.addEventListener("contextmenu", e => {
          stopPropagation(); //阻止冒泡事件
          // 右键时关闭所有菜单
          for (let i = 0; i < GLOBLEsize; i++) {
            removeMenu("tt_right_menu" + i); //关闭菜单
          }
          var menuX = e.pageX || e.pageY ? e.pageX : e.clientX + document.body.scrollLeft - document.body.clientLeft; //获取pageX 兼容ie
          var menuY = e.pageX || e.pageY ? e.pageY : e.clientY + document.body.scrollTop - document.body.clientTop;

          document.getElementById("TT_MASK").style = Maskstyle + "display:block";
          if (!document.getElementById("tt_right_menu" + currentSize)) {
            let boxDiv = document.createElement("ul");
            binding.value.map(item => {
              let isDisabled = false;
              if (typeof item.disabled == "boolean") {
                isDisabled = item.disabled;
              } else {
                try {
                  isDisabled = eval(item.disabled);
                } catch (e) {
                  try {
                    isDisabled = eval("vnode.context." + item.disabled);
                  } catch (e) {
                    console.log(e);
                  }
                }
              }

              let optionp = document.createElement("li");
              if (item.title) {
                //如果有title属性则设置
                optionp.setAttribute("title", item.title);
              }
              optionp.setAttribute("unselectable", "on");
              optionp.setAttribute("class", "right-menu-row");
              if (isDisabled) {
                //菜单项禁用
                optionp.setAttribute("class", "right-menu-row disabled");
                if (item.disabledTitle) {
                  //如果有禁用时的title属性则设置
                  optionp.setAttribute("title", item.disabledTitle);
                }
              }

              //兼容用户没有callback的情况
              if (item.callback) {
                if (isDisabled) {
                  //disabled时没有点击事件
                  optionp.onclick = function() {
                    return false;
                  };
                } else {
                  optionp.onclick = vnode.context[item.callback];
                }
              } else {
                optionp.onclick = function() {
                  return false;
                };
              }

              //在菜单上右键不会再出现系统菜单
              boxDiv.addEventListener("contextmenu", e => {
                stopPropagation(); //阻止冒泡事件
              });
              optionp.addEventListener("contextmenu", e => {
                stopPropagation(); //阻止冒泡事件
              });
              //在菜单上左键会关闭菜单
              optionp.addEventListener("click", e => {
                if (!isDisabled) {
                  //disabled则不会关闭
                  removeMenu("tt_right_menu" + currentSize); //关闭菜单
                }
              });
              //监听按键事件关闭菜单
              document.addEventListener("keyup", function(e) {
                if (e.keyCode == 27) removeMenu("tt_right_menu" + currentSize); //关闭菜单
              });

              if (item.content) {
                if (item.content === "---") {
                  //分割线
                  optionp.setAttribute("class", "right-menu-line");
                } else {
                  if (item.description) {
                    //有备注时
                    if (item.descriptionPosition === "right") {
                      optionp.innerHTML = "<div class='content'><p>" + item.content + "<span class='description' style='float:right;'>" + item.description + "</span></p></div>";
                    } else {
                      optionp.innerHTML = "<div  class='content'><p>" + item.content + "</p><p class='description'>" + item.description + "</p></div>";
                    }
                  } else {
                    optionp.innerHTML = "<div  class='content'><p>" + item.content + "</p>";
                  }
                }
              }
              /**
               * 兼容屏幕出界的情况；
               */
              optionp.style = `overflow: hidden;text-overflow:ellipsis;white-space:nowrap;margin-block-start: 0em;margin-block-end: 0em;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;${
                binding.value["optionStyle"] ? binding.value["optionStyle"] : ""
              };${item["style"] ? item["style"] : ""};`;
              boxDiv.appendChild(optionp);
            });
            boxDiv.setAttribute("class", "right-menu");
            boxDiv.setAttribute("id", "tt_right_menu" + currentSize);
            boxDiv.style = `${binding.value["boxStyle"] ? binding.value["boxStyle"] : ""};position:fixed;z-index:99999;top:${menuY}px;left:${menuX}px;`;
            document.body.appendChild(boxDiv);
            //判断是否超出屏幕宽度
            if (menuX + boxDiv.clientWidth >= document.body.clientWidth) {
              boxDiv.style.left = menuX - boxDiv.clientWidth + "px";
            }
            //判断是否超出屏幕高度
            if (menuY + boxDiv.clientHeight >= document.body.clientHeight) {
              boxDiv.style.top = menuY - boxDiv.clientHeight + "px";
            }
          }
        });
        GLOBLEsize++;
        //点击菜单之外时关闭菜单
        document.getElementById("TT_MASK").addEventListener("click", () => {
          removeMenu("tt_right_menu" + currentSize); //关闭菜单
        });
        //右键点击菜单之外时关闭菜单
        document.getElementById("TT_MASK").addEventListener("contextmenu", e => {
          stopPropagation(); //阻止冒泡事件
          removeMenu("tt_right_menu" + currentSize); //关闭菜单
        });
      }
      /*
            unbind(el) {
                el.removeEventListener("contextmenu");
            }
            */
    });
  }
};

//阻止冒泡事件
function stopPropagation() {
  var e = event || window.event;
  e.stopPropagation(); //阻止冒泡事件
  e.cancelBubble = true; //阻止冒泡事件ie
  e.preventDefault(); //阻止默认事件
}

//关闭菜单
function removeMenu(name) {
  let menu = document.getElementById(name);
  if (menu) document.body.removeChild(menu);
  document.getElementById("TT_MASK").style = "display:none";
}

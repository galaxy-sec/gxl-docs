# gx.defined

## 功能描述
检查变量是否已定义。

## 语法定义
```gxl
gx.defined(${变量名})
```

## 示例代码
```gxl
// 检查变量是否已定义
if (gx.defined(${MY_VAR})) {
  gx.echo { value: "MY_VAR已定义，值为: ${MY_VAR}" }
} else {
  gx.echo { value: "MY_VAR未定义" }
}
```
# gx.tpl

## 功能描述
使用模板引擎处理文件模板。

## 语法定义
```gxl
gx.tpl {
  tpl: <模板内容>,       // 模板内容
  dst: <目标文件路径>,   // 生成文件的路径
  data: <数据变量名>,    // 模板数据变量名（可选）
  engine: <引擎类型>,    // 模板引擎类型（可选）
  file: <模板文件路径>   // 模板文件路径（可选，与tpl互斥）
}
```

## 示例代码
```gxl
// 使用内联模板
gx.tpl {
  tpl: "Hello, {{name}}! Welcome to {{app_name}}.",
  dst: "output.txt",
  data: "user_data"
}

// 使用模板文件
gx.tpl {
  file: "template.txt",
  dst: "output.txt",
  data: "template_data"
}
```
# gx.echo

## 功能描述
输出文本信息到控制台。

## 语法定义
```gxl
gx.echo {
  value: <文本内容>,     // 要输出的文本内容
  file: <文件路径>,      // 输出到文件的路径（可选）
  export: <变量名>,      // 导出为环境变量的名称（可选）
  inc: <布尔值>          // 是否追加到文件末尾（可选）
}
```

## 示例代码
```gxl
// 输出简单文本
gx.echo {
  value: "Hello, Galaxy Flow!"
}

// 输出到文件
gx.echo {
  value: "This is a log entry",
  file: "app.log"
}

// 追加到文件
gx.echo {
  value: "Additional information",
  file: "app.log",
  inc: true
}

// 导出为环境变量
gx.echo {
  value: "production",
  export: "ENV_TYPE"
}
```
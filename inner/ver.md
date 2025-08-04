# gx.ver

## 功能描述
管理和操作版本信息。

## 语法定义
```gxl
gx.ver {
  value: <版本值>,       // 版本值
  default: <默认值>,     // 默认版本值（可选）
  file: <文件路径>,      // 版本文件路径（可选）
  export: <变量名>,      // 导出版本信息的变量名（可选）
  inc: <递增类型>        // 版本递增类型（可选，可选值：build/bugfix/feature/main）
}
```

## 示例代码
```gxl
// 设置版本值
gx.ver {
  value: "1.2.3"
}

// 从文件读取版本并递增
gx.ver {
  file: "VERSION",
  inc: "feature"
}

// 导出版本信息
gx.ver {
  value: "2.0.0",
  export: "APP_VERSION"
}
```
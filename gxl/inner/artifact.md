# gx.artifact

## 功能描述
处理构建产物文件。

## 语法定义
```gxl
gx.artifact {
  file: <文件路径>,       // 构建产物文件路径
  dst_path: <目标路径>    // 目标存储路径
}
```

## 示例代码
```gxl
// 处理构建产物
gx.artifact {
  file: "target/release/myapp",
  dst_path: "artifacts/v1.0.0/"
}
```
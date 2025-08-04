# gx.tar 和 gx.untar

## 功能描述
创建和解压tar归档文件。

## 语法定义
```gxl
// 创建tar归档
gx.tar {
  src: <源文件/目录>,     // 要归档的源文件或目录
  file: <归档文件名>      // 生成的归档文件名
}

// 解压tar归档
gx.untar {
  file: <归档文件名>,     // 要解压的归档文件
  dst: <目标目录>         // 解压到的目标目录
}
```

## 示例代码
```gxl
// 创建tar归档
gx.tar {
  src: "src/",
  file: "source.tar"
}

// 解压tar归档
gx.untar {
  file: "source.tar",
  dst: "extracted/"
}
```
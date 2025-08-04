# gx.download 和 gx.upload

## 功能描述
下载和上传文件。

## 语法定义
```gxl
// 下载文件
gx.download {
  url: <下载URL>,        // 文件下载URL
  local_file: <本地路径>, // 保存到本地的文件路径
  username: <用户名>,     // 认证用户名（可选）
  password: <密码>        // 认证密码（可选）
}

// 上传文件
gx.upload {
  url: <上传URL>,        // 文件上传URL
  local_file: <本地路径>, // 要上传的本地文件路径
  method: <HTTP方法>,     // HTTP方法（如POST、PUT等，默认POST）
  username: <用户名>,     // 认证用户名（可选）
  password: <密码>        // 认证密码（可选）
}
```

## 示例代码
```gxl
// 下载文件
gx.download {
  url: "https://example.com/file.zip",
  local_file: "downloaded_file.zip"
}

// 上传文件
gx.upload {
  url: "https://example.com/upload",
  local_file: "local_file.txt",
  method: "POST"
}
```
# gx.cmd

## 功能描述
执行系统命令或脚本。

## 语法定义
```gxl
gx.cmd {
  cmd: <命令字符串>,     // 要执行的命令
  shell: <Shell类型>,    // 指定使用的Shell（可选）
  out: <输出变量名>,     // 捕获命令标准输出的变量名（可选）
  err: <错误变量名>,     // 捕获命令错误输出的变量名（可选）
  suc: <成功标识>,       // 命令执行成功的标识（可选）
  sudo: <布尔值>,        // 是否使用sudo权限执行（可选）
  log: <日志级别>,       // 日志记录级别（可选）
  silence: <布尔值>      // 是否静默执行（可选）
}
```

## 示例代码
```gxl
// 执行简单命令
gx.cmd {
  cmd: "ls -la"
}

// 执行命令并捕获输出
gx.cmd {
  cmd: "date",
  out: "current_date"
}

// 使用sudo权限执行命令
gx.cmd {
  cmd: "systemctl restart nginx",
  sudo: true
}
```
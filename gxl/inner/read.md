# gx.read

## 功能描述
从不同来源读取数据并存储到变量中。

## 语法定义
```gxl
// 从文件读取
gx.read_file {
  file: <文件路径>,      // 要读取的文件路径
  name: <变量名>         // 存储文件内容的变量名
}

// 从标准输入读取
gx.read_stdin {
  name: <变量名>,        // 存储输入内容的变量名
  prompt: <提示文本>     // 输入提示文本（可选）
}

// 从命令输出读取
gx.read_cmd {
  cmd: <命令字符串>,     // 要执行的命令
  name: <变量名>,        // 存储命令输出的变量名
  shell: <Shell类型>     // 指定使用的Shell（可选）
}
```

## 示例代码
```gxl
// 从文件读取内容
gx.read_file {
  file: "config.json",
  name: "config_data"
}

// 从标准输入读取
gx.read_stdin {
  name: "user_input",
  prompt: "请输入您的姓名: "
}

// 从命令输出读取
gx.read_cmd {
  cmd: "git rev-parse HEAD",
  name: "commit_hash"
}
```
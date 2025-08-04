# gx.shell

## 功能描述
执行Shell脚本文件。

## 语法定义
```gxl
gx.shell {
  shell: <脚本文件路径>,  // 要执行的Shell脚本文件路径
  arg_file: <参数文件>,   // 参数文件路径（可选）
  out_var: <输出变量名>,  // 捕获脚本输出的变量名（可选）
  default: <默认脚本>     // 默认脚本文件路径（可选，与shell互斥）
}
```

## 示例代码
```gxl
// 执行Shell脚本
gx.shell {
  shell: "deploy.sh"
}

// 执行脚本并捕获输出
gx.shell {
  shell: "build.sh",
  out_var: "build_output"
}

// 使用参数文件
gx.shell {
  shell: "install.sh",
  arg_file: "install.args"
}
```
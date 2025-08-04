# Galaxy Flow 内置能力文档

本文档详细描述了Galaxy Flow中所有内置能力的语法定义和使用示例。

## gx.assert

### 功能描述
执行断言检查，验证表达式的值是否符合预期。

### 语法定义
```gxl
gx.assert {
  value: <表达式>,      // 要检查的值
  expect: <期望值>,     // 期望的值
  err: <错误信息>,      // 断言失败时的错误信息（可选）
  result: <变量名>      // 存储断言结果的变量名（可选）
}
```

### 示例代码
```gxl
// 检查变量值是否等于期望值
gx.assert {
  value: ${MY_VAR},
  expect: "expected_value",
  err: "MY_VAR值不正确"
}

// 检查表达式结果并存储结果
gx.assert {
  value: ${CALC_RESULT},
  expect: 42,
  result: "assert_result"
}
```

## gx.cmd

### 功能描述
执行系统命令或脚本。

### 语法定义
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

### 示例代码
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

## gx.echo

### 功能描述
输出文本信息到控制台。

### 语法定义
```gxl
gx.echo {
  value: <文本内容>,     // 要输出的文本内容
  file: <文件路径>,      // 输出到文件的路径（可选）
  export: <变量名>,      // 导出为环境变量的名称（可选）
  inc: <布尔值>          // 是否追加到文件末尾（可选）
}
```

### 示例代码
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

## gx.read

### 功能描述
从不同来源读取数据并存储到变量中。

### 语法定义
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

### 示例代码
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

## gx.vars

### 功能描述
定义和设置多个变量。

### 语法定义
```gxl
gx.vars {
  <变量名1>: <值1>,      // 变量名和对应的值
  <变量名2>: <值2>,      // 可以定义多个变量
  // ...
}
```

### 示例代码
```gxl
// 定义多个变量
gx.vars {
  app_name: "MyApp",
  version: "1.0.0",
  debug: true
}

// 使用变量引用
gx.vars {
  project_root: "${HOME}/projects",
  config_file: "${project_root}/config.yaml"
}
```

## gx.tpl

### 功能描述
使用模板引擎处理文件模板。

### 语法定义
```gxl
gx.tpl {
  tpl: <模板内容>,       // 模板内容
  dst: <目标文件路径>,   // 生成文件的路径
  data: <数据变量名>,    // 模板数据变量名（可选）
  engine: <引擎类型>,    // 模板引擎类型（可选）
  file: <模板文件路径>   // 模板文件路径（可选，与tpl互斥）
}
```

### 示例代码
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

## gx.ver

### 功能描述
管理和操作版本信息。

### 语法定义
```gxl
gx.ver {
  value: <版本值>,       // 版本值
  default: <默认值>,     // 默认版本值（可选）
  file: <文件路径>,      // 版本文件路径（可选）
  export: <变量名>,      // 导出版本信息的变量名（可选）
  inc: <递增类型>        // 版本递增类型（可选，可选值：build/bugfix/feature/main）
}
```

### 示例代码
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

## gx.shell

### 功能描述
执行Shell脚本文件。

### 语法定义
```gxl
gx.shell {
  shell: <脚本文件路径>,  // 要执行的Shell脚本文件路径
  arg_file: <参数文件>,   // 参数文件路径（可选）
  out_var: <输出变量名>,  // 捕获脚本输出的变量名（可选）
  default: <默认脚本>     // 默认脚本文件路径（可选，与shell互斥）
}
```

### 示例代码
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

## gx.download 和 gx.upload

### 功能描述
下载和上传文件。

### 语法定义
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

### 示例代码
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

## gx.tar 和 gx.untar

### 功能描述
创建和解压tar归档文件。

### 语法定义
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

### 示例代码
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

## gx.artifact

### 功能描述
处理构建产物文件。

### 语法定义
```gxl
gx.artifact {
  file: <文件路径>,       // 构建产物文件路径
  dst_path: <目标路径>    // 目标存储路径
}
```

### 示例代码
```gxl
// 处理构建产物
gx.artifact {
  file: "target/release/myapp",
  dst_path: "artifacts/v1.0.0/"
}
```

## gx.run

### 功能描述
运行其他GXL工作流文件。

### 语法定义
```gxl
gx.run {
  local: <工作流路径>,    // 要运行的工作流文件路径
  env: <环境配置>,        // 环境配置（可选）
  flow: <流程列表>,       // 要执行的流程列表（可选）
  conf: <配置文件>,       // 配置文件路径（可选）
  isolate: <布尔值>       // 是否隔离环境（可选）
}
```

### 示例代码
```gxl
// 运行其他工作流
gx.run {
  local: "./subflow.gxl"
}

// 在特定环境中运行工作流
gx.run {
  local: "./deploy.gxl",
  env: "production",
  flow: "build,deploy"
}

// 隔离环境运行
gx.run {
  local: "./test.gxl",
  isolate: true
}
```

## gx.defined

### 功能描述
检查变量是否已定义。

### 语法定义
```gxl
gx.defined(${变量名})
```

### 示例代码
```gxl
// 检查变量是否已定义
if (gx.defined(${MY_VAR})) {
  gx.echo { value: "MY_VAR已定义，值为: ${MY_VAR}" }
} else {
  gx.echo { value: "MY_VAR未定义" }
}
```
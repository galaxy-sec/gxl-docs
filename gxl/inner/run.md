# gx.run

## 功能描述
运行其他GXL工作流文件。

## 语法定义
```gxl
gx.run {
  local: <工作流路径>,    // 要运行的工作流文件路径
  env: <环境配置>,        // 环境配置（可选）
  flow: <流程列表>,       // 要执行的流程列表（可选）
  conf: <配置文件>,       // 配置文件路径（可选）
  isolate: <布尔值>       // 是否隔离环境（可选）
}
```

## 示例代码
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
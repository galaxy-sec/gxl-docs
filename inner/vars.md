# gx.vars

## 功能描述
定义和设置多个变量。

## 语法定义
```gxl
gx.vars {
  <变量名1>: <值1>,      // 变量名和对应的值
  <变量名2>: <值2>,      // 可以定义多个变量
  // ...
}
```

## 示例代码
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
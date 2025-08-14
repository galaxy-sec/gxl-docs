# GXL 语法帮助文档

## 概述

GXL（Galaxy Flow Language）是一种为 DevSecOps 自动化工作流设计的领域特定语言。它采用模块化、层次化的结构设计，支持环境配置、流程编排、函数定义和活动重用等核心功能。

## 语言结构

### 顶层结构

GXL 文件由一系列模块定义组成，每个模块包含环境、流程、函数和活动等组件：

```gxl
// 外部模块引用
extern mod mod_a { path = "@{PATH}"; }

// 模块定义
mod my_module : mod_a, mod_b {
    // 模块属性
    author = "John Doe";
    version = "1.0";
    
    // 环境定义
    env dev {
        root = "${HOME}/project";
    }
    
    // 流程定义
    flow main {
        gx.echo(value: "Hello World");
    }
    
    // 函数定义
    fn greet(name) {
        gx.echo(value: "Hello, ${name}!");
    }
    
    // 活动定义
    activity task_runner {
        timeout = "30s";
        retry_count = 3;
    }
}
```

### 核心组件

#### 1. 模块（Modules）

模块是 GXL 的顶层组织单元，用于组织相关的环境、流程、函数和活动。

**语法：**
```gxl
[Annotation] mod ModuleName [: ModuleRefList] {
    ModuleContent
}
```

**示例：**
```gxl
#[author("John Doe")]
#[version("1.0")]
mod main : utils, common {
    author = "John Doe";
    version = "1.0";
    
    env production {
        root = "/app/production";
    }
}
```

#### 2. 环境（Environments）

环境用于配置不同的执行上下文，支持环境继承和变量定义。

**语法：**
```gxl
[Annotation] env EnvName [: EnvRefList] {
    EnvContent
}
```

**示例：**
```gxl
env base {
    log_level = "info";
}

env development : base {
    root = "${HOME}/dev";
    debug = true;
    
    gx.read_cmd(
        name: "DEV_PATH",
        cmd: "pwd"
    );
}
```

**环境专用命令：**
- `gx.vars` - 定义变量
- `gx.read_cmd` - 从命令输出读取变量
- `gx.read_stdin` - 从标准输入读取变量
- `gx.read_file` - 从文件读取变量

#### 3. 流程（Flows）

流程表示工作流程序，支持定义形式。

**定义流程语法：**
```gxl
[Annotation] flow [FlowRefList |] @FlowName [| FlowRefList] {
    FlowContent
}
```

**示例：**
```gxl
// 定义流程
#[usage("主流程")]
flow setup | @main | cleanup {
    gx.echo(value: "Starting main process");
    
    // 条件分支
    if ${DEBUG} == "true" {
        gx.echo(value: "Debug mode enabled");
    } else {
        gx.echo(value: "Production mode");
    }
    
    // 通配符比较
    if ${VERSION} =* "1.*" {
        gx.echo(value: "Version 1.x detected");
    }
}
```

**流程编排：**
```gxl
flow prepare {
    gx.echo(value: "Preparing environment");
}

flow process {
    gx.echo(value: "Processing data");
}

flow finalize {
    gx.echo(value: "Finalizing process");
}

// 执行顺序: prepare -> process -> finalize
flow @main | process | finalize {
    gx.echo(value: "Main process");
}

// 执行顺序: prepare -> main -> finalize
flow prepare | @main | finalize {
    gx.echo(value: "Main process with preparation");
}
```

#### 4. 函数（Functions）

函数是可重用的代码单元，支持参数传递和返回值。

**语法：**
```gxl
[Annotation] fn FunctionName([FunctionParams]) {
    FunctionContent
}
```

**示例：**
```gxl
fn greet(name, message = "Hello") {
    gx.echo(value: "${message}, ${name}!");
}

fn deploy_service(service, *env) {
    gx.echo(value: "Deploying ${service} to ${env}");
    gx.cmd(cmd: "kubectl apply -f ${service}.yaml");
}
```

#### 5. 活动（Activities）

活动是可重用的操作单元，通常用于封装复杂的操作逻辑。

**语法：**
```gxl
[Annotation] activity ActivityName {
    ActivityContent
}
```

**示例：**
```gxl
#[timeout("30s")]
activity file_copy {
    src = "";
    dst = "";
    log = "true";
    retry_count = 3;
    executor = "copy_act.sh";
}

// 活动调用
flow copy_files {
    file_copy(
        src: "/source/file.txt",
        dst: "/destination/file.txt"
    );
}
```

## 内置命令

GXL 提供了丰富的内置命令，使用函数调用语法：

### 1. gx.echo
输出消息到控制台。

**语法：**
```gxl
gx.echo(value: "message");
```

**示例：**
```gxl
gx.echo(value: "Hello World");
gx.echo(value: "Variable value: ${VAR}");
```

### 2. gx.cmd
执行系统命令。

**语法：**
```gxl
gx.cmd(cmd: "command");
```

**示例：**
```gxl
gx.cmd(cmd: "ls -la");
gx.cmd(cmd: "kubectl get pods");
```

### 3. gx.vars
定义变量。

**语法：**
```gxl
gx.vars {
    name: "value"
}
```

**示例：**
```gxl
gx.vars {
    APP_NAME: "my-app",
    VERSION: "1.0.0"
}
```

### 4. gx.read
读取文件内容。

**语法：**
```gxl
gx.read(file: "path", name: "var_name");
```

**示例：**
```gxl
gx.read(file: "config.json", name: "config");
```

### 5. gx.tpl
模板渲染。

**语法：**
```gxl
gx.tpl(template: "template.tpl", output: "output.txt");
```

**示例：**
```gxl
gx.tpl(template: "deploy.yaml.tpl", output: "deploy.yaml");
```

### 6. gx.assert
断言检查。

**语法：**
```gxl
gx.assert(condition: "expression", message: "error message");
```

**示例：**
```gxl
gx.assert(condition: "${STATUS} == 'success'", message: "Operation failed");
```

### 7. gx.ver
版本检查。

**语法：**
```gxl
gx.ver(version: "required_version");
```

**示例：**
```gxl
gx.ver(version: "1.0.0");
```

## 变量和引用

### 变量定义
```gxl
// 在环境中定义
env dev {
    app_name = "my-app";
    version = "1.0.0";
}

// 使用 gx.vars 定义
gx.vars {
    BUILD_ID: "12345",
    TIMESTAMP: "2023-01-01"
}
```

### 变量引用
```gxl
// 环境变量引用
${HOME}
${PATH}

// GXL 变量引用
${app_name}
${version}

// 嵌套引用
${${PREFIX}_name}
```

### 外部模块引用
```gxl
// 路径引用
extern mod utils { path = "@{PATH}/utils"; }

// Git 引用
extern mod common {
    git = "https://github.com/example/common.git",
    channel = "main"
}
```

## 注解（Annotations）

注解用于为模块、环境、流程等添加元数据。

**语法：**
```gxl
#[AnnotationName[(param: "value")]]
```

**示例：**
```gxl
#[author("John Doe")]
#[version("1.0")]
#[usage("主流程")]
#[timeout("30s")]
mod main {
    // 内容
}
```

## 条件语句

### if-else 语句
```gxl
flow check_version {
    if ${VERSION} == "1.0" {
        gx.echo(value: "Version 1.0 detected");
    } else {
        gx.echo(value: "Other version detected");
    }
}
```

### 通配符比较
```gxl
flow check_pattern {
    if ${VERSION} =* "1.*" {
        gx.echo(value: "Version 1.x detected");
    }
    
    if ${NAME} =* "test-*" {
        gx.echo(value: "Test environment detected");
    }
}
```

## 最佳实践

### 1. 模块组织
```gxl
// 将相关功能组织到模块中
mod database {
    env production {
        host = "db.prod.example.com";
        port = 5432;
    }
    
    flow backup {
        gx.cmd(cmd: "pg_dump ${DB_NAME} > backup.sql");
    }
}

mod deployment {
    env staging {
        k8s_context = "staging-cluster";
    }
    
    flow deploy {
        gx.cmd(cmd: "kubectl apply -f deployment.yaml");
    }
}
```

### 2. 环境继承
```gxl
// 基础环境
env base {
    log_level = "info";
    timeout = "30s";
}

// 继承基础环境
env development : base {
    debug = true;
    root = "${HOME}/dev";
}

env production : base {
    debug = false;
    root = "/app";
}
```

### 3. 错误处理
```gxl
flow safe_operation {
    gx.assert(condition: "${FILE_EXISTS} == 'true'", 
               message: "File does not exist");
    
    if ${STATUS} != "success" {
        gx.echo(value: "Operation failed, rolling back");
        // 回滚逻辑
    }
}
```

### 4. 参数化函数
```gxl
fn deploy(app, env, version = "latest") {
    gx.echo(value: "Deploying ${app} version ${version} to ${env}");
    
    if ${env} == "production" {
        gx.assert(condition: "${version} != 'latest'", 
                   message: "Cannot deploy latest to production");
    }
    
    gx.cmd(cmd: "kubectl set image deployment/${app} ${app}=${app}:${version}");
}

// 使用函数
flow main {
    deploy("my-app", "staging");
    deploy("my-app", "production", "1.2.3");
}
```

## 执行方式

### 命令行执行
```bash
# 执行指定环境的流程
gflow -e dev main

# 执行多个流程
gflow -e prod setup,deploy,test

# 使用默认环境
gflow main
```

### 模块加载
只有 `envs` 和 `main` 两个模块中的环境和流程可以直接通过 CLI 加载执行。

```gxl
mod envs {
    env dev {}
    env prod {}
}

mod main {
    flow deploy {}
    flow test {}
}
```

## 常见问题

### Q: 如何调试 GXL 脚本？
A: 使用 `gx.echo` 输出变量值和执行状态，在开发环境中设置 `debug = true`。

### Q: 如何处理敏感信息？
A: 使用环境变量或配置文件存储敏感信息，避免在 GXL 文件中硬编码密码等敏感数据。

### Q: 如何优化流程执行性能？
A: 合理使用流程编排，避免重复操作，使用函数封装常用逻辑，适当使用并行执行。

### Q: 如何处理依赖关系？
A: 使用模块引用和环境继承来管理依赖，确保执行顺序正确。

## 总结

GXL 是一个功能强大的 DevSecOps 自动化语言，通过模块化设计、环境配置、流程编排和函数重用等特性，可以帮助用户构建复杂的自动化工作流。掌握 GXL 语法和最佳实践，可以显著提高工作效率和代码质量。

---

*本文档基于 GXL 语法定义和实现代码编写，如需了解更详细的技术实现，请参考相关源代码文件。*
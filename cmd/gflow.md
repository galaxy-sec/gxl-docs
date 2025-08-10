# gflow 命令使用文档

## 概述
`gflow` 是 Galaxy Flow 的核心执行引擎，用于运行 GXL 流程文件。

## 基本用法

```bash
gflow [OPTIONS] [FLOW]...
```

## 参数说明

### 位置参数
- `FLOW...`: 要执行的流程名称，例如：conf, test, package

### 选项参数
- `-e, --env <ENV>`: 环境名称，例如：-e dev（默认：default）
- `-d, --debug <DEBUG>`: 调试级别，例如：-d 1（默认：0）
- `-f, --conf <CONF>`: 配置文件路径，默认为：
  - work: `./_rg/work.gxl`
  - adm: `./_rg/adm.gxl`
- `--log <LOG>`: 配置日志级别，例如：--log cmd=debug,parse=info
- `-q, --quiet`: 静默模式
- `-h, --help`: 显示帮助信息
- `-V, --version`: 显示版本信息

## 使用示例

### 基本执行
```bash
# 执行默认工作流
gflow

# 执行指定流程
gflow conf test package
```

### 环境切换
```bash
# 使用开发环境
gflow -e dev

# 使用生产环境
gflow -e prod
```

### 调试模式
```bash
# 启用调试模式
gflow -d 2

# 配置详细日志
gflow --log cmd=debug,parse=info
```

### 指定配置
```bash
# 使用自定义配置文件
gflow -f ./config/my-config.gxl
```

## 配置文件
默认配置文件为：
- `./_rg/work.gxl` - 工作流配置
- `./_rg/adm.gxl` - 管理配置

配置文件包含：
- 任务定义
- 变量配置
- 模块引用
- 执行策略

## 环境变量
- `GALAXY_FLOW_HOME`: Galaxy Flow 主目录
- `RUST_LOG`: Rust 日志级别

## 返回值
- `0`: 执行成功
- `非0`: 执行失败，返回错误码

## 常见问题

### 找不到配置文件
确保当前目录下有 `_rg/work.gxl` 或 `_rg/adm.gxl` 文件，或使用 `-f` 指定配置文件。

### 权限问题
确保有执行权限：
```bash
chmod +x gflow
```

### 模块加载失败
检查网络连接和模块路径配置。
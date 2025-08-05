# Galaxy Operations System - Manual Pages

本目录包含 Galaxy Operations System 所有命令行工具的 man page 文档。

## 可用命令

### 系统管理工具
- **gsys(1)** - Galaxy Operations System 管理工具
  - 管理系统配置和部署
  - 命令：new, update, localize

### 模块管理工具
- **gmod(1)** - Galaxy 模块管理工具
  - 管理模块规范和配置
  - 命令：example, new, update, localize

### 操作管理工具
- **gops(1)** - Galaxy 操作管理工具
  - 综合操作管理，包括创建、导入、更新
  - 命令：new, import, update, localize, setting

## 使用方法

查看特定命令的帮助：
```bash
man gsys    # 查看 gsys 命令文档
man gmod    # 查看 gmod 命令文档
man gops    # 查看 gops 命令文档
```

## 通用选项

所有命令都支持以下通用选项：

- `-d, --debug <level>` - 设置调试输出级别 (0-4)
- `--log <log_config>` - 配置日志输出格式
- `--value <file>` - 使用指定的值文件进行本地化
- `--default` - 启用默认模块模式

## 安装 Man Page

将 man page 安装到系统：
```bash
# 复制到系统 man page 目录
sudo cp docs/man/man1/*.1 /usr/local/share/man/man1/

# 更新 man page 索引
sudo mandb
```

## 文档格式

所有 man page 使用标准的 troff 格式，符合 Unix man page 规范。

## 更新日志

- 2024-12-19: 初始版本，包含 gsys, gmod, gops 的完整文档
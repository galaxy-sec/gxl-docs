# 系统操作符 (System Operator)

## 概述
系统操作符用于定义和管理一个完整的系统，它组合了多个模块操作符来构建复杂的系统环境。系统操作符通过 `sys_model.yml` 定义系统的基本信息，通过 `mod_list.yml` 定义所包含的模块列表。

## 文件结构
一个典型的系统操作符项目具有以下文件结构：

example_sys/
├── .gitignore
├── sys_model.yml
├── mod_list.yml
├── vars.yml
├── mods/
│   ├── mysql_mock/
│   │   └── arm-mac14-host/
│   └── redis_mock/
│       └── arm-mac14-host/
└── workflows/
    └── operators.gxl

### 核心文件说明

1. **sys_model.yml**: 定义系统的基本信息
   ```yaml
   name: example_sys
   model: arm-mac14-host
   vender: ''
   ```

2. **mod_list.yml**: 定义系统包含的模块列表
   ```yaml
   - name: redis_mock
     addr:
       path: ./example/modules/redis_mock
     model: arm-mac14-host
   - name: mysql_mock
     addr:
       path: ./example/modules/mysql_mock
     model: arm-mac14-host
   ```

3. **mods/**: 存放系统包含的各个模块的具体实现

4. **workflows/operators.gxl**: 定义系统的操作工作流

5. **vars.yml**: 系统级别的变量配置文件

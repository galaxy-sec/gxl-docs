# Changelog

## 0.7.0
### 新增
* 支持事务机制 
* 支持dryrun机制 - 允许预览操作结果而不实际执行

### 0.6.4  
### 新增
* 支持 gx.cmd  quiet (静默） - 自定义控制cmd的日志输出与否


### 0.6.2
### 新增
* 优化日志输出，增加日志的重定向，支持捕获控制台标准日志输出


## 0.6.0
### 新增
* 生成任务报告 - 提供执行过程和结果的详细信息
* 支持flow上的Task注解 - 增强流程定义的灵活性

### 改进
* 改进 flow 编排语法，由: 变为 |  符号


## gflow-0.5.3

### 内置环境变量
- GXL_PRJ_ROOT:    最近定义的 _gal/project.toml 的目录

###  extern mod 支持变量
 ```
 extern mod head { path = "${GXL_START_ROOT}/_gal/"; }
 ```
[0.5.3 下载](https://github.com/galaxy-sec/galaxy-flow/releases/tag/v0.5.3)

## 0.5.2
### 内置环境变量
- GXL_START_ROOT:  GXL 启动处理的目录
- GXL_CUR_DIR:  GXL 当前所在目录，在调用gx.run时，与GXL_START_ROOT可能不同

## 0.5.1
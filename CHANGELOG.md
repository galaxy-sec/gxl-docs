# Changelog

## 0.5.3

### 内置环境变量
- GXL_PRJ_ROOT:   最近定义了 _gal/project.toml 的目录

###  extern mod 支持变量
 ```
 extern mod head { path = "${GXL_START_ROOT}/_gal/"; }
 ```

## 0.5.2
### 内置环境变量
- GXL_START_ROOT:  GXL 启动处理的目录
- GXL_CUR_DIR:  GXL 当前所在目录，在调用gx.run时，与GXL_START_ROOT可能不同

## 0.5.1

GMod

```bash
Usage: gmod <COMMAND>

Commands:
  example   
  new       
  localize  
  help      Print this message or the help of the given subcommand(s)

Options:
  -h, --help     Print help
  -V, --version  Print version
```

```
├── arm-mac14-host
│   ├── _gal
│   │   └── work.gxl
│   ├── setting.yml
│   ├── spec
│   │   ├── artifact.yml
│   │   ├── conf.yml
│   │   ├── logs.yml
│   │   ├── res.yml
│   │   └── vars.yml
│   └── workflows
│       ├── setup.gxl
│       └── update.gxl
└── x86-ubt22-k8s
    ├── _gal
    │   └── work.gxl
    ├── setting.yml
    ├── spec
    │   ├── artifact.yml
    │   ├── conf.yml
    │   ├── logs.yml
    │   ├── res.yml
    │   └── vars.yml
    └── workflows
        ├── setup.gxl
        └── update.gxl
```

## setting.yml
```yaml
localize:
  templatize_path:
    excludes:
    - spec/confs/templates
  templatize_cust:
    label_beg: '[['
    label_end: ']]'
```

### templatize_path
* includes :  包含的目录,  默认为spec目录
* excludes :  排除的目录

### templatize_cust
* label_beg :  模板标签开始, 默认为'{{'
* label_end :  模板标签结束, 默认为'}}'

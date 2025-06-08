Usage: gsys <COMMAND>

Commands:
  example   
  new       
  load      
  update    
  localize  
  help      Print this message or the help of the given subcommand(s)

Options:
  -h, --help     Print help
  -V, --version  Print version



## mod-list

```yaml
mods:
- name: example_mod1
  addr:
    path: ./example/modules/example_mod1
  node: arm-mac14-host
  effective: false
- name: postgresql
  addr:
    path: ./example/modules/postgresql
  node: arm-mac14-host
  depends:
  - addr:
      path: ./example/knowlege/mysql
    local: depends
  effective: null
```

### depends
  * addr : 依赖的模块地址
  * local : 依赖的模块本地地址
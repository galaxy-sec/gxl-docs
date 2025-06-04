# gflow

```bash
Usage: gflow [OPTIONS] [FLOW]...

Arguments:
  [FLOW]...  flow name ; eg: conf,test,package

Options:
  -e, --env <ENV>      env name ; eg: -e dev [default: default]
  -d, --debug <DEBUG>  debug level ; eg: -d 1 [default: 0]
  -f, --conf <CONF>    conf file ;  default is  work(./_rg/work.gxl) adm (./_rg/adm.gxl)
      --log <LOG>      config log ; eg: --log  cmd=debug,parse=info
  -q, --quiet          
  -h, --help           Print help
  -V, --version        Print version
```
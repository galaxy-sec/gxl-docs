# Template Example

This example demonstrates how to use templates in GXL.

```rust
extern mod os { path = "../../_gal/mods"; }

mod base_env {
    env _common {
        gx.vars {
            DOMAIN = "domain";
            SOCK_FILE = "socket";
            GXL_PRJ_ROOT = "./";
        }
    }
    env cli : _common {
        ROOT = "./";
    }
    env unit_test : _common {
        ROOT = "./example";
    }
}

mod envs : base_env {
    #[usage(desp = "default")]
    env default : cli;
    env empty {}
    env ut : unit_test;
}

mod main {
    conf = "${ENV_ROOT}/conf";
    flow conf {
        os.path(dst: "${MAIN_CONF}/used", keep: "true");
        gx.tpl(
            tpl: "${MAIN_CONF}/tpls/",
            dst: "${MAIN_CONF}/used/",
            file: "${MAIN_CONF}/value.json");

        ```cmd
        echo "hello";
        cp ./conf/value.json ./conf/used/back.json;
        ```
    }
}
```

## Description

This example shows how to use the `gx.tpl` command to process template files. In the `conf` flow, the `os.path` command is first used to create the target directory, then the `gx.tpl` command renders template files from the `tpls` directory based on values in the `value.json` file and outputs them to the `used` directory. Finally, an inline shell command block is shown to copy a file.
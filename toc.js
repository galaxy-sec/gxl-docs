// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> README</a></li><li class="chapter-item expanded "><a href="CHANGELOG.html"><strong aria-hidden="true">2.</strong> Changelog</a></li><li class="chapter-item expanded "><a href="cmd/ops/index.html"><strong aria-hidden="true">3.</strong> 命令行工具</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="cmd/gflow.html"><strong aria-hidden="true">3.1.</strong> gflow</a></li></ol></li><li class="chapter-item expanded "><a href="operator/index.html"><strong aria-hidden="true">4.</strong> 维护器</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="operator/sys/index.html"><strong aria-hidden="true">4.1.</strong> 系统维护器</a></li><li class="chapter-item expanded "><a href="operator/mod/index.html"><strong aria-hidden="true">4.2.</strong> 模块维护器</a></li></ol></li><li class="chapter-item expanded "><a href="gxl/gxl.html"><strong aria-hidden="true">5.</strong> GXL</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="gxl/const.html"><strong aria-hidden="true">5.1.</strong> 常量</a></li><li class="chapter-item expanded "><a href="gxl/var_def.html"><strong aria-hidden="true">5.2.</strong> 数据类型</a></li><li class="chapter-item expanded "><a href="gxl/env.html"><strong aria-hidden="true">5.3.</strong> env</a></li><li class="chapter-item expanded "><a href="gxl/flow.html"><strong aria-hidden="true">5.4.</strong> flow</a></li><li class="chapter-item expanded "><a href="gxl/fun.html"><strong aria-hidden="true">5.5.</strong> fun</a></li><li class="chapter-item expanded "><a href="syntax.html"><strong aria-hidden="true">5.6.</strong> 语法说明</a></li><li class="chapter-item expanded "><a href="gxl/example/index.html"><strong aria-hidden="true">5.7.</strong> 示例</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="gxl/example/assert.html"><strong aria-hidden="true">5.7.1.</strong> 断言示例</a></li><li class="chapter-item expanded "><a href="gxl/example/dryrun.html"><strong aria-hidden="true">5.7.2.</strong> 试运行示例</a></li><li class="chapter-item expanded "><a href="gxl/example/fun.html"><strong aria-hidden="true">5.7.3.</strong> 函数示例</a></li><li class="chapter-item expanded "><a href="gxl/example/read.html"><strong aria-hidden="true">5.7.4.</strong> 读取示例</a></li><li class="chapter-item expanded "><a href="gxl/example/shell.html"><strong aria-hidden="true">5.7.5.</strong> shell示例</a></li><li class="chapter-item expanded "><a href="gxl/example/template.html"><strong aria-hidden="true">5.7.6.</strong> 模板示例</a></li><li class="chapter-item expanded "><a href="gxl/example/transaction.html"><strong aria-hidden="true">5.7.7.</strong> 事务示例</a></li><li class="chapter-item expanded "><a href="gxl/example/vars.html"><strong aria-hidden="true">5.7.8.</strong> 变量示例</a></li></ol></li><li class="chapter-item expanded "><a href="gxl/inner/index.html"><strong aria-hidden="true">5.8.</strong> 内置指令</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="gxl/inner/artifact.html"><strong aria-hidden="true">5.8.1.</strong> artifact</a></li><li class="chapter-item expanded "><a href="gxl/inner/assert.html"><strong aria-hidden="true">5.8.2.</strong> assert</a></li><li class="chapter-item expanded "><a href="gxl/inner/cmd.html"><strong aria-hidden="true">5.8.3.</strong> cmd</a></li><li class="chapter-item expanded "><a href="gxl/inner/defined.html"><strong aria-hidden="true">5.8.4.</strong> defined</a></li><li class="chapter-item expanded "><a href="gxl/inner/download_upload.html"><strong aria-hidden="true">5.8.5.</strong> download_upload</a></li><li class="chapter-item expanded "><a href="gxl/inner/echo.html"><strong aria-hidden="true">5.8.6.</strong> echo</a></li><li class="chapter-item expanded "><a href="gxl/inner/read.html"><strong aria-hidden="true">5.8.7.</strong> read</a></li><li class="chapter-item expanded "><a href="gxl/inner/run.html"><strong aria-hidden="true">5.8.8.</strong> run</a></li><li class="chapter-item expanded "><a href="gxl/inner/shell.html"><strong aria-hidden="true">5.8.9.</strong> shell</a></li><li class="chapter-item expanded "><a href="gxl/inner/tar_untar.html"><strong aria-hidden="true">5.8.10.</strong> tar_untar</a></li><li class="chapter-item expanded "><a href="gxl/inner/tpl.html"><strong aria-hidden="true">5.8.11.</strong> tpl</a></li><li class="chapter-item expanded "><a href="gxl/inner/vars.html"><strong aria-hidden="true">5.8.12.</strong> vars</a></li><li class="chapter-item expanded "><a href="gxl/inner/ver.html"><strong aria-hidden="true">5.8.13.</strong> ver</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="work.html"><strong aria-hidden="true">6.</strong> 工作任务</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);

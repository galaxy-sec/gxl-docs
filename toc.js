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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> README</a></li><li class="chapter-item expanded "><a href="gxl.html"><strong aria-hidden="true">2.</strong> GXL</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="var_def.html"><strong aria-hidden="true">2.1.</strong> var_def</a></li><li class="chapter-item expanded "><a href="env.html"><strong aria-hidden="true">2.2.</strong> env</a></li><li class="chapter-item expanded "><a href="flow.html"><strong aria-hidden="true">2.3.</strong> flow</a></li><li class="chapter-item expanded "><a href="fun.html"><strong aria-hidden="true">2.4.</strong> fun</a></li></ol></li><li class="chapter-item expanded "><a href="gflow.html"><strong aria-hidden="true">3.</strong> gflow</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="buildin.html"><strong aria-hidden="true">3.1.</strong> BUILDIN</a></li></ol></li><li class="chapter-item expanded "><a href="syntax.html"><strong aria-hidden="true">4.</strong> 语法说明</a></li><li class="chapter-item expanded "><a href="example/index.html"><strong aria-hidden="true">5.</strong> 示例</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="example/assert.html"><strong aria-hidden="true">5.1.</strong> 断言示例</a></li><li class="chapter-item expanded "><a href="example/dryrun.html"><strong aria-hidden="true">5.2.</strong> 试运行示例</a></li><li class="chapter-item expanded "><a href="example/fun.html"><strong aria-hidden="true">5.3.</strong> 函数示例</a></li><li class="chapter-item expanded "><a href="example/read.html"><strong aria-hidden="true">5.4.</strong> 读取示例</a></li><li class="chapter-item expanded "><a href="example/shell.html"><strong aria-hidden="true">5.5.</strong> shell示例</a></li><li class="chapter-item expanded "><a href="example/template.html"><strong aria-hidden="true">5.6.</strong> 模板示例</a></li><li class="chapter-item expanded "><a href="example/transaction.html"><strong aria-hidden="true">5.7.</strong> 事务示例</a></li><li class="chapter-item expanded "><a href="example/vars.html"><strong aria-hidden="true">5.8.</strong> 变量示例</a></li></ol></li><li class="chapter-item expanded "><a href="inner/index.html"><strong aria-hidden="true">6.</strong> 内置指令</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="inner/artifact.html"><strong aria-hidden="true">6.1.</strong> artifact</a></li><li class="chapter-item expanded "><a href="inner/assert.html"><strong aria-hidden="true">6.2.</strong> assert</a></li><li class="chapter-item expanded "><a href="inner/cmd.html"><strong aria-hidden="true">6.3.</strong> cmd</a></li><li class="chapter-item expanded "><a href="inner/defined.html"><strong aria-hidden="true">6.4.</strong> defined</a></li><li class="chapter-item expanded "><a href="inner/download_upload.html"><strong aria-hidden="true">6.5.</strong> download_upload</a></li><li class="chapter-item expanded "><a href="inner/echo.html"><strong aria-hidden="true">6.6.</strong> echo</a></li><li class="chapter-item expanded "><a href="inner/read.html"><strong aria-hidden="true">6.7.</strong> read</a></li><li class="chapter-item expanded "><a href="inner/run.html"><strong aria-hidden="true">6.8.</strong> run</a></li><li class="chapter-item expanded "><a href="inner/shell.html"><strong aria-hidden="true">6.9.</strong> shell</a></li><li class="chapter-item expanded "><a href="inner/tar_untar.html"><strong aria-hidden="true">6.10.</strong> tar_untar</a></li><li class="chapter-item expanded "><a href="inner/tpl.html"><strong aria-hidden="true">6.11.</strong> tpl</a></li><li class="chapter-item expanded "><a href="inner/vars.html"><strong aria-hidden="true">6.12.</strong> vars</a></li><li class="chapter-item expanded "><a href="inner/ver.html"><strong aria-hidden="true">6.13.</strong> ver</a></li></ol></li><li class="chapter-item expanded "><a href="work.html"><strong aria-hidden="true">7.</strong> 工作任务</a></li><li class="chapter-item expanded "><a href="CHANGELOG.html"><strong aria-hidden="true">8.</strong> Changelog</a></li></ol>';
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

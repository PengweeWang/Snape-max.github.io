// 确保所有依赖已加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 markdown-it
    const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            return `<pre class="code-block"><code class="language-${lang}">${str}</code></pre>`;
        }
    });
    
    // 应用插件
    md.use(window.markdownitFootnote);
    md.use(window.markdownitSub);
    md.use(window.markdownitSup);
    md.use(window.markdownitTaskLists);

    // 初始化 Monaco Editor
    require(['vs/editor/editor.main'], function() {
        // 创建编辑器实例
        const editor = monaco.editor.create(document.getElementById('editor'), {
            value: `# 欢迎使用 Markdown 编辑器

这是一个功能完整的 Markdown 在线编辑器，支持以下功能：

- **实时预览** - 边写边看效果
- **数学公式** - 使用 KaTeX 渲染
- **多种主题** - 可切换不同样式
- **导入导出** - 方便保存和分享

## 数学公式示例

行内公式：$E = mc^2$

块级公式：
$$
\\int_0^\\infty x^2 dx
$$

## 代码示例

\`\`\`javascript
function hello() {
    console.log("Hello, Markdown!");
}
\`\`\`

## 任务列表

- [x] 实现基本编辑功能
- [ ] 添加更多主题
- [ ] 优化移动端体验
            `,
            language: 'markdown',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 14,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection'
        });

        // 获取DOM元素
        const preview = document.getElementById('preview');
        const exportBtn = document.getElementById('export-btn');
        const importBtn = document.getElementById('import-btn');
        const themeSelector = document.getElementById('theme-selector');
        const customThemeInput = document.getElementById('custom-theme-input');
        const applyThemeBtn = document.getElementById('apply-theme-btn');
        const togglePreviewBtn = document.getElementById('toggle-preview-btn');
        const helpBtn = document.getElementById('help-btn');
        const resizer = document.querySelector('.resizer');
        const editorContainer = document.querySelector('.editor-container');
    

        // 渲染Markdown
        function renderMarkdown() {
            const content = editor.getValue();
            preview.innerHTML = md.render(content);
            
            // 确保 KaTeX 已加载
            if (window.renderMathInElement) {
                renderMathInElement(preview, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            }
        }

        // 初始渲染
        renderMarkdown();

        // 监听编辑器内容变化
        editor.onDidChangeModelContent(debounce(renderMarkdown, 300));

        // 防抖函数
        function debounce(func, wait) {
            let timeout;
            return function() {
                clearTimeout(timeout);
                timeout = setTimeout(func, wait);
            };
        }

        // 导出Markdown文件
        exportBtn.addEventListener('click', () => {
            const content = editor.getValue();
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'markdown-export.md';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // 导入Markdown文件
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.md,.markdown';
            
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = event => {
                    editor.setValue(event.target.result);
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        });

        // 主题切换
        themeSelector.addEventListener('change', () => {
            if (themeSelector.value === 'custom') {
                customThemeInput.style.display = 'block';
                applyThemeBtn.style.display = 'block';
            } else {
                customThemeInput.style.display = 'none';
                applyThemeBtn.style.display = 'none';
                setTheme(themeSelector.value);
            }
        });

        // 应用自定义主题
        applyThemeBtn.addEventListener('click', () => {
            const themeUrl = customThemeInput.value.trim();
            if (themeUrl) {
                setTheme(themeUrl);
            }
        });

        // 设置主题函数
        function setTheme(themeUrl) {
            const themeLink = document.getElementById('markdown-theme');
            themeLink.href = themeUrl;
        }

        // 切换预览模式
        togglePreviewBtn.addEventListener('click', () => {
            editorContainer.classList.toggle('full-preview');
            togglePreviewBtn.textContent = editorContainer.classList.contains('full-preview') 
                ? '显示编辑器' 
                : '全屏预览';
        });

        // 显示帮助信息
        helpBtn.addEventListener('click', () => {
            alert(`Markdown 编辑器使用帮助：

    1. 编辑：左侧编辑器输入Markdown内容
    2. 预览：右侧实时显示渲染结果
    3. 导出：将当前内容保存为.md文件
    4. 导入：从文件加载Markdown内容
    5. 主题：切换不同的Markdown渲染样式
    6. 全屏预览：隐藏编辑器，专注预览

    数学公式支持：
    - 行内公式: $...$ 或 \\(...\\)
    - 块级公式: $$...$$ 或 \\[...\\]`);
        });

        // 拖动调整编辑器/预览宽度
        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const containerWidth = editorContainer.clientWidth;
            const newEditorWidth = Math.max(200, Math.min(e.clientX, containerWidth - 200));
            const newPreviewWidth = containerWidth - newEditorWidth;
            
            document.querySelector('.editor').style.width = `${newEditorWidth}px`;
            document.querySelector('.preview').style.width = `${newPreviewWidth}px`;
            resizer.style.left = `${newEditorWidth}px`;
        });

        window.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = '';
        });

        // 响应式设计 - 移动端切换
        function checkMobile() {
            if (window.innerWidth <= 768) {
                editorContainer.classList.add('mobile-preview');
                togglePreviewBtn.textContent = '显示编辑器';
            } else {
                editorContainer.classList.remove('mobile-preview');
                togglePreviewBtn.textContent = '全屏预览';
            }
        }

        window.addEventListener('resize', checkMobile);
        checkMobile();

    });
});
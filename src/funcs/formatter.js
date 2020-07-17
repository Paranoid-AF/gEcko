import '../styles/highlightjs.less';
import hljs from 'highlight.js';
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
});
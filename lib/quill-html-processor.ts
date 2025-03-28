/**
 * This utility processes HTML generated by React Quill to improve
 * compatibility with Tailwind's typography plugin
 */

export function processQuillHtml(html: string): string {
  // Skip processing if HTML is empty
  if (!html) return '';

  // Process lists - convert Quill specific list items to standard HTML
  const processedLists = html
    // Make list items work properly
    .replace(/<li data-list="ordered">/g, '<li>')
    .replace(/<li data-list="bullet">/g, '<li>')
    // Remove contenteditable attributes
    .replace(/contenteditable="false"/g, '')
    // Remove Quill UI spans
    .replace(/<span class="ql-ui"><\/span>/g, '');

  // Process code blocks - ensure they render properly
  const processedCodeBlocks = processedLists
    // Transform Quill code blocks to standard pre/code blocks
    .replace(
      /<div class="ql-code-block-container" spellcheck="false">(.*?)<div class="ql-code-block" data-language="(.+?)">(.+?)<\/div><\/div>/gs, 
      '<pre><code class="language-$2">$3</code></pre>'
    )
    // Handle plain code blocks without language
    .replace(
      /<div class="ql-code-block-container" spellcheck="false">(.*?)<div class="ql-code-block"( data-language="")*>(.+?)<\/div><\/div>/gs,
      '<pre><code>$3</code></pre>'
    );

  return processedCodeBlocks;
} 
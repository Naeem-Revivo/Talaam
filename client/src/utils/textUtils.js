/**
 * Strip HTML tags and return plain text
 * Handles code tags with data attributes like <code data-start="997" data-end="1000">=</code>
 * @param {string} html - HTML string to clean
 * @returns {string} Plain text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html) return "";
  
  // Create a temporary div element to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // Get text content which automatically strips HTML tags
  return tmp.textContent || tmp.innerText || "";
};

/**
 * Clean HTML code tags with data attributes
 * Converts <code data-start="997" data-end="1000">=</code> to just the content (=)
 * Preserves other HTML formatting like <b>, <strong>, <i>, <em>, <u>, etc.
 * @param {string} html - HTML string to clean
 * @returns {string} Cleaned HTML string (still HTML, but without problematic code tags)
 */
export const cleanCodeTags = (html) => {
  if (!html) return "";
  
  // Remove code tags with data attributes, keeping only the content
  // This preserves other HTML formatting like bold, italic, underline, etc.
  return html.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1');
};

/**
 * Clean HTML for display (removes code tags with data attributes but keeps other HTML formatting)
 * Use this when rendering with dangerouslySetInnerHTML to preserve bold, italic, underline, etc.
 * @param {string} html - HTML string to clean
 * @returns {string} Cleaned HTML string with formatting preserved
 */
export const cleanHtmlForDisplay = (html) => {
  if (!html) return "";
  
  // Remove code tags with data attributes, keeping only the content
  // This preserves all other HTML formatting like <b>, <strong>, <i>, <em>, <u>, <p>, etc.
  let cleaned = cleanCodeTags(html);
  
  // Replace HTML entities with their actual characters
  // Order matters: handle escaped entities first (like &amp;nbsp;), then regular entities
  // This ensures entities like &nbsp; are rendered as spaces, not shown as text
  cleaned = cleaned
    .replace(/&amp;nbsp;/g, ' ')       // Escaped non-breaking space (&amp;nbsp;) to space
    .replace(/&nbsp;/g, ' ')           // Non-breaking space to regular space
    .replace(/&amp;lt;/g, '<')         // Escaped less-than (&amp;lt;) to <
    .replace(/&amp;gt;/g, '>')         // Escaped greater-than (&amp;gt;) to >
    .replace(/&amp;quot;/g, '"')       // Escaped quote (&amp;quot;) to "
    .replace(/&amp;amp;/g, '&')        // Double-escaped ampersand (&amp;amp;) to &
    .replace(/&amp;/g, '&')             // &amp; to & (must be after &amp;amp;)
    .replace(/&lt;/g, '<')             // &lt; to <
    .replace(/&gt;/g, '>')             // &gt; to >
    .replace(/&quot;/g, '"')           // &quot; to "
    .replace(/&#39;/g, "'")             // &#39; to '
    .replace(/&apos;/g, "'");           // &apos; to '
  
  return cleaned;
};

/**
 * Strip all HTML tags and clean code tags
 * This is the main function to use for displaying question text
 * @param {string} html - HTML string to clean
 * @returns {string} Plain text
 */
export const cleanQuestionText = (html) => {
  if (!html) return "";
  
  // First clean code tags with data attributes
  let cleaned = cleanCodeTags(html);
  
  // Then strip all remaining HTML tags
  return stripHtmlTags(cleaned);
};


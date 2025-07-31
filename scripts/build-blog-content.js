/**
 * Build script to process markdown blog posts at build time
 * This eliminates the need for client-side markdown parsing
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeAddClasses from 'rehype-add-classes';
import rehypeSanitize from 'rehype-sanitize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/blog');
const OUTPUT_FILE = path.join(__dirname, '../public/blog-content.json');

/**
 * Process a single markdown file
 */
async function processMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    // Process markdown to HTML using rehype plugins for robust transformation
    const processedContent = await remark()
      .use(gfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeSanitize) // Sanitize HTML to prevent XSS attacks
      .use(rehypeSlug) // Add IDs to headings
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // Wrap headings in anchor links
      .use(rehypeAddClasses, {
        // Add styling classes using AST-based transformation
        'h1': 'text-4xl font-bold mb-6',
        'h2': 'text-3xl font-semibold mb-4 mt-8',
        'h3': 'text-2xl font-semibold mb-3 mt-6',
        'h4': 'text-xl font-semibold mb-2 mt-4',
        'p': 'mb-4 leading-relaxed',
        'ul': 'list-disc list-inside mb-4 space-y-2',
        'ol': 'list-decimal list-inside mb-4 space-y-2',
        'blockquote': 'border-l-4 border-primary pl-4 italic my-4',
        'pre': 'bg-muted p-4 rounded-lg overflow-x-auto mb-4',
        'code': 'bg-muted px-1 py-0.5 rounded text-sm',
        'a': 'text-gold hover:underline transition-colors'
      })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdownContent);
    
    const htmlContent = processedContent.toString();
    
    // Extract slug from filename
    const filename = path.basename(filePath);
    const slug = filename.replace('.md', '');
    
    return {
      slug,
      frontmatter,
      content: htmlContent,
      excerpt: frontmatter.excerpt || markdownContent.slice(0, 200).replace(/[#*`]/g, '').trim() + '...'
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

// The enhanceHtmlContent function has been replaced with rehype plugins
// for more robust AST-based HTML transformation

/**
 * Main build function
 */
async function buildBlogContent() {
  console.log('Building blog content...');
  
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Read all markdown files
    const files = await fs.readdir(CONTENT_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`Found ${markdownFiles.length} markdown files`);
    
    // Process all files
    const posts = await Promise.all(
      markdownFiles.map(file => 
        processMarkdownFile(path.join(CONTENT_DIR, file))
      )
    );
    
    // Filter out any failed processes (HTML enhancement now done via rehype plugins)
    const validPosts = posts
      .filter(post => post !== null)
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0);
        const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0);
        
        // Validate dates and warn if invalid
        if (isNaN(dateA.getTime())) {
          console.warn(`Invalid date for post "${a.slug}": ${a.frontmatter.date}`);
        }
        if (isNaN(dateB.getTime())) {
          console.warn(`Invalid date for post "${b.slug}": ${b.frontmatter.date}`);
        }
        
        return dateB.getTime() - dateA.getTime();
      });
    
    console.log(`Successfully processed ${validPosts.length} posts`);
    
    // Write to output file
    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify(validPosts, null, 2),
      'utf-8'
    );
    
    console.log(`Blog content written to ${OUTPUT_FILE}`);
    
    // Also create a lightweight index for faster initial loads
    const index = validPosts.map(({ slug, frontmatter, excerpt }) => ({
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt,
      image: frontmatter.image,
      categories: frontmatter.categories,
      author: frontmatter.author,
      readTime: frontmatter.readTime,
      featured: frontmatter.featured
    }));
    
    await fs.writeFile(
      path.join(outputDir, 'blog-index.json'),
      JSON.stringify(index, null, 2),
      'utf-8'
    );
    
    console.log('Blog index created');
    
  } catch (error) {
    console.error('Error building blog content:', error);
    process.exit(1);
  }
}

// Run the build
buildBlogContent();
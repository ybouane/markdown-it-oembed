# Installation
`npm install markdown-it-oembed --save`

# How it works
This plugin uses a list of providers `providers.json` to match embeddable URLs and retrieves the HTML code required to display the embed.
Since the oEmbed process requires making an HTTP request, it must be done asynchronously. I have reimplemented the `MarkdownIt.render` function to support that. The new function is called ` MarkdownIt.renderAsync` (or for inline: 
`MarkdownIt.renderInlineAsync`)

In the markdown code, you need to put the embed URL in the image tag as follows:
`!(Palm trees)[https://www.instagram.com/p/B_Iu6rqA_gY/]`

# Example usage
```const md = require('markdown-it');
const MarkdownItOEmbed = require('markdown-it-oembed');

md.use(MarkdownItOEmbed);

console.log(await md.renderAsync(`!(Palm trees)[https://www.instagram.com/p/B_Iu6rqA_gY/]`));
```

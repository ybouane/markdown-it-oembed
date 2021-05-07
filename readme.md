# Installation
`npm install markdown-it-oembed --save`

# How it works
This plugin uses a list of providers `providers.json` to match embeddable URLs and retrieves the HTML code required to display the embed.
Since the oEmbed process requires making an HTTP request, it must be done asynchronously. I have reimplemented the `MarkdownIt.render` function to support that. The new function is called ` MarkdownIt.renderAsync` (or for inline:
`MarkdownIt.renderInlineAsync`)

In the markdown code, you need to put the embed URL in the image tag as follows:

`![Getting Started: Sktch.io](https://www.youtube.com/watch?v=CMfBj0U221k)`

# Example usage
```
const MarkdownIt 			= require('markdown-it');
const MarkdownItOEmbed 			= require('markdown-it-oembed');

var md = new MarkdownIt({
	linkify	: true,
	breaks	: false,
});
md.use(MarkdownItOEmbed);
(async () => {
	console.log(await md.renderAsync('![Getting Started: Sktch.io](https://www.youtube.com/watch?v=CMfBj0U221k)'));
})();
```

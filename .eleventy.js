// 11ty Plugins
const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

// Helper packages
const slugify = require("slugify");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote")
// Local utilities/data
const packageVersion = require("./package.json").version;
const pluginTOC = require('eleventy-plugin-toc');

const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(socialImages);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginTOC, {
  tags: ['h2', 'h3', 'h4'], // which heading tags are selected headings must each have an ID attribute
  wrapper: 'nav',           // element to put around the root `ol`/`ul`
  wrapperClass: 'toc',      // class for the element around the root `ol`/`ul`
  ul: false,                // if to use `ul` instead of `ol`
  flat: false,              // if subheadings should appear as child of parent or as a sibling
})
  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("packageVersion", () => `v${packageVersion}`);



 // two date filters for the map templates
  // I actually need to refactor/rewrite as templates nayway I think.
  eleventyConfig.addFilter("findDate", (item) => {
    let dateReference= item.data.date || item.data.year || item.data.time || item.geojson?.features?.properties?.time || item.geojson?.features?.properties?.start
    return DateTime.fromISO(dateReference).toISODate()})
  
  eleventyConfig.addFilter("dateToUnix", (item) => {
    let dateReference= item.data.date || item.data.year || item.data.time || item.geojson?.properties?.time || item.geojson?.properties?.start
    return DateTime.fromISO(dateReference).valueOf()})

    
 // dealing with json
 const util = require('util')

 eleventyConfig.addFilter('stringify', obj => {
   return JSON.stringify(obj)
 });
 // stolen from https://github.com/11ty/eleventy/issues/266#issuecomment-450397156
 eleventyConfig.addFilter('serializeMaps', (value) => {
   const mapData = value.map((map) => {
     
     return map.data.geojson ? {
       date: map.date,
       url: map.url,
       data: {
         title: map.data.title,
         excerpt: map.data.excerpt,
         geojson: map.data.geojson
       },
     } : null;
   });

   return JSON.stringify(
     mapData.filter( data => data  ),
    null, 2);
 });

 eleventyConfig.addFilter("findDate", (item) => {
   let dateReference= item.data.date || item.data.year || item.data.time || item.geojson?.features?.properties?.time || item.geojson?.features?.properties?.start
   return DateTime.fromISO(dateReference).toISODate()})
 
 eleventyConfig.addFilter("dateToUnix", (item) => {
   let dateReference= item.data.date || item.data.year || item.data.time || item.geojson?.properties?.time || item.geojson?.properties?.start
   return DateTime.fromISO(dateReference).valueOf()})

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      strict: true,
      remove: /["]/g,
    });
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      class: "tdbc-anchor",
      space: false,
      symbol: "🔗",
    }),
    level: [1, 2, 3],
    slugify: (str) =>
      slugify(str, {
        lower: true,
        strict: true,
        remove: /["]/g,
      }),
  }).use(markdownItFootnote);
  eleventyConfig.setLibrary("md", markdownLibrary);

  

  return {
    passthroughFileCopy: true,
    pathPrefix: "/hh-project-11ty-starter-kit",
    dir: {
      input: "src",
      output: "docs",
      layouts: "_layouts",
    },
  };
};

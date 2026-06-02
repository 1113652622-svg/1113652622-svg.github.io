const stylesheet = '<link rel="stylesheet" href="/css/article.css">';

hexo.extend.filter.register("after_render:html", (html) => {
  if (html.includes(stylesheet) || !html.includes("</head>")) {
    return html;
  }

  return html.replace("</head>", `${stylesheet}</head>`);
});

const DEFAULT_ARTICLE_COVER = "images/uploads/default-cover.jpg";

function normalizeCoverPath(cover) {
  if (typeof cover !== "string") {
    return cover;
  }

  const path = cover.trim();

  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("//")) {
    return `/${path.replace(/^\/+/, "")}`;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function randomCover(count, images) {
  if (!Array.isArray(images) || images.length === 0) {
    return count > 1 ? [] : "";
  }

  const select = () => normalizeCoverPath(
    images[Math.floor(Math.random() * images.length)]
  );

  return count > 1 ? Array.from({ length: count }, select) : select();
}

function fixedCover() {
  return normalizeCoverPath(hexo.theme.config.homeConfig?.fixedCover || "");
}

function headerCover(item) {
  if (item.background) {
    return normalizeCoverPath(item.background);
  }

  return fixedCover() || randomCover(1, hexo.theme.config.image_list);
}

hexo.extend.filter.register("before_generate", () => {
  hexo.extend.helper.register("_image_url", normalizeCoverPath);

  hexo.extend.helper.register("_cover", function(item, count = 1) {
    if (item.cover) {
      return normalizeCoverPath(item.cover);
    }

    if (item.photos && item.photos.length > 0) {
      return normalizeCoverPath(item.photos[0]);
    }

    const cover = normalizeCoverPath(DEFAULT_ARTICLE_COVER);
    return count > 1 ? Array.from({ length: count }, () => cover) : cover;
  });

  hexo.extend.helper.register("_cover_index", function(item) {
    if (!item.__index) {
      return headerCover(item);
    }

    const { image_list: images, index_images: indexImages } = hexo.theme.config;
    return randomCover(6, indexImages && indexImages.length ? indexImages : images);
  });
});

hexo.extend.filter.register("template_locals", (locals) => {
  if (!locals.page.__index && locals.page.background && locals.theme.homeConfig?.fixedCover) {
    locals.theme = {
      ...locals.theme,
      homeConfig: {
        ...locals.theme.homeConfig,
        fixedCover: ""
      }
    };
  }
});

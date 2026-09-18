/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ignda.github.io/brigada",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  trailingSlash: true,
  exclude: ["/admin", "/admin/", "/admin/**", "/server-sitemap.xml"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin/" },
    ],
    additionalSitemaps: ["https://ignda.github.io/brigada/sitemap.xml"],
  },
  transform: async (config, path) => {
    const priorityMap = {
      "/": 1.0,
      "/quem-somos": 0.8,
      "/atuacao": 0.8,
      "/nossos-trabalhos": 0.9,
    };
    const changefreqMap = {
      "/": "weekly",
      "/quem-somos": "monthly",
      "/atuacao": "monthly",
      "/nossos-trabalhos": "daily",
    };
    return {
      loc: path,
      changefreq: changefreqMap[path] || "weekly",
      priority: priorityMap[path] || 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

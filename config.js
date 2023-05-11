/**
 * VuePress config file: `docs/.vuepress/config.js`.
 * Documentation: https://vuepress.vuejs.org/config/.
 */

const sidebar = require('./sidebar.js');
const nav = require('./nav.js');
const head = require('./head.js');
const devServer = require('./devServer.js');
const markdown = require('./markdown.js');

module.exports = {
    base: '/dcr-docs-pub/',
    description: 'Dynamic Client Registration specification',
    // https://vuepress.vuejs.org/config/#head
    head: [
        ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/img/icons/favicon-32x32.png"}],
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/img/icons/favicon-16x16.png"}],
        ['link', { rel: "shortcut icon", href: "/assets/img/icons/favicon.ico"}],
    ],
    // https://vuepress.vuejs.org/theme/default-theme-config.html
    themeConfig: {
        // search: false,
        logo: '/assets/img/open-banking-logo.svg',
        // logo: '/assets/img/OBIE_logotype_blue_RGB.jpg',
        sidebar,
        nav,
        sidebarDepth: 0,
        // https://vuepress.vuejs.org/theme/default-theme-config.html#search-box
        searchMaxSuggestions: 20,
        // https://vuepress.vuejs.org/theme/default-theme-config.html#smooth-scrolling
        smoothScroll: true,
        // https://vuepress.vuejs.org/theme/default-theme-config.html#last-updated
        lastUpdated: false,
        // https://vuepress.vuejs.org/theme/default-theme-config.html#git-repository-and-edit-links
        // repo: 'OpenBankingUK/dcr-docs-pub',
        // editLinks: true,

        // // https://vuepress.vuejs.org/theme/default-theme-config.html#git-repository-and-edit-links
        // // Disabling these for now. For more information, please see these issue reports:
        // // * .
        // // * .
        // // * .
        // // default value is true. Allows to hide next page links on all pages
        // nextLinks: false,
        // // default value is true. Allows to hide prev page links on all pages
        // prevLinks: false,
    },
    markdown,
    extendMarkdown: (md) => {
        // use more markdown-it plugins!
        // Converts '\n' in paragraphs into <br>
        // md.set({ breaks: true });
        // console.log('extendMarkdown md=', md);
        return md;
    },
    plugins: [
        // https://vuepress.vuejs.org/plugin/official/plugin-back-to-top.html
        '@vuepress/back-to-top',
        // https://vuepress.vuejs.org/plugin/official/plugin-nprogress.html
        '@vuepress/nprogress',
        // https://vuepress.vuejs.org/plugin/official/plugin-search.html
        [
            '@vuepress/search',
            {
                searchMaxSuggestions: 30,
                // Ideally we want all the search results but the container rendering the
                // search results does not have scrollbars so all the results are not displayed.
                // searchMaxSuggestions: Number.MAX_SAFE_INTEGER,
            },
        ],
        // [
        //     (pluginOptions, context) => {
        //         const name = 'read-write-api-site-plugin-header';
        //         console.log('plugins[%s] - md=', name, pluginOptions);
        //         console.log('plugins[%s] - context=', name, context);
        //         return {
        //             name,
        //             globalUIComponents: [
        //                 // 'Component-1',
        //                 // 'Component-2'
        //             ]
        //         };
        //     },
        // ]
    ],
    // These settings configures the server that is started when you do `yarn docs:dev`.
    // With the current configuration settings, if you open Google Chrome DevTools after navigating
    // to the site, it will display any compilation warnings/errors related to Markdown amongst other things.
    devServer,
    // https://cli.vuejs.org/config/#css-sourcemap
    css: {
        sourceMap: true,
    },
    // https://cli.vuejs.org/config/#runtimecompiler
    runtimeCompiler: true,
    // https://vuepress.vuejs.org/config/#chainwebpack
    chainWebpack: (config, isServer) => {
        // TODO(mbana): This doesn't work, so fix it.
        //
        // Inline fonts and images so we don't do another fetch for them.
        // If we set `limit` to zero, all the fonts and images are inlined.
        // Explanation can be found in:
        // * https://cli.vuejs.org/guide/webpack.html#replacing-loaders-of-a-rule
        // * https://github.com/vuejs/vue-cli/issues/3215

        // console.log('chainWebpack: isServer=', isServer);

        // config.module.rule('fonts').use('url-loader').tap((opts) => {
        //     const options = Object.assign(opts, { limit: 0 });
        //     return options;
        // });

        // config.module.rule('images').use('url-loader').tap((opts) => {
        //     const options = Object.assign(opts, { limit: 0 });
        //     return options;
        // });

        return config;
    },
    // https://vuepress.vuejs.org/config/#evergreen
    // This will disable ES5 transpilation and polyfills for IE, and result in faster builds and smaller files.
    // Set to true, if we want to support IE.
    evergreen: true,
    // https://vuepress.vuejs.org/config/#extrawatchfiles
    extraWatchFiles: [
        '.vuepress/devServer.js',
        '.vuepress/enhanceApp.js',
        '.vuepress/head.js',
        '.vuepress/markdown.js',
        '.vuepress/nav.js',
        '.vuepress/sidebar.js',
    ],
};

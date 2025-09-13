import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "UNCHAIN BUIDL",
  staticDirectories: ["public", "static"],
  tagline: "build in web3",
  favicon: "/favicon/favicon.ico",

  // site production url
  url: "https://unchain-tech.github.io/",
  baseUrl: "/", // "/REPOSITORY_NAME/", when not using a custom domain

  // GitHub pages deployment config
  organizationName: "unchain-tech",
  projectName: "UNCHAIN-projects",
  deploymentBranch: "main",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    localeConfigs: {
      ja: {
        htmlLang: 'ja-JP',
        label: "日本語",
      },
      en: {
        htmlLang: 'en-GB',
        label: "English",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/unchain-tech/UNCHAIN-projects/tree/main/",
        },
        blog: false,
        // theme: {
        //   customCss: "./src/css/custom.css",
        // },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's width/height
        min: 640, // min resized image's width/height
        steps: 2, // number of sizes between min and max (inclusive)
        disableInDev: false,
      },
    ],
  ],

  themeConfig: {
    image: "/thumbnail/unchain-banner.png",
    navbar: {
      title: "BUIDL",
      logo: {
        alt: "UNCHAIN",
        src: "/logo/unchain.png",
        srcDark: "/logo/unchain.dark.png",
      },
      items: [
        // Right
        {
          href: "https://github.com/unchain-tech/UNCHAIN-Projects",
          position: "right",
          label: "GitHub",
        },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr style="margin: 0.3rem 0;">',
            },
            {
              href: 'https://github.com/unchain-tech/UNCHAIN-Projects/issues/3526',
              label: 'Help Us Translate',
            },
          ],
        }
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "About us",
          items: [
            {
              label: "Website",
              href: "https://www.unchain.tech/",
            },
            {
              label: "GitHub",
              href: "https://github.com/unchain-tech/",
            },
          ],
        },
        {
          title: "Learn",
          items: [
            {
              label: "Buidl Tutorials",
              href: "https://buidl.unchain.tech/",
            },
           {
              label: "EIP Encyclopedia",
              href: "https://eips.unchain.tech/",
            },
            {
              label: "Auditing resources",
              href: "https://bughunt.unchain.tech/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/invite/w3AyyvKypT",
            },
            {
              label: "X",
              href: "https://x.com/UNCHAIN_tech",
            },
          ],
        },
      ],
      copyright: `MIT license © ${new Date().getFullYear()} UNCHAIN. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity'],
    },
  } satisfies Preset.ThemeConfig
};

export default config;

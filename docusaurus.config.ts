import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "UNCHAIN BUIDL",
  staticDirectories: ["public", "static"],
  tagline: "build in web3",
  favicon: "https://www.unchain.tech/favicon.ico",

  // site production url
  url: "https://unchain-tech.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/UNCHAIN-projects/",

  // GitHub pages deployment config
  organizationName: "unchain-tech",
  projectName: "UNCHAIN-projects",
  deploymentBranch: "main",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "ja",
    locales: ["ja"],
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

  themeConfig: {
    image: "images/README/unchain-banner.png",
    navbar: {
      title: "BUIDL",
      logo: {
        alt: "UNCHAIN",
        src: "https://www.unchain.tech/logo/UNCHAIN_logo.png",
      },
      items: [
        // {
        //   type: "docSidebar",
        //   sidebarId: "tutorialSidebar",
        //   position: "left",
        //   label: "Tutorial",
        // },
        {
          href: "https://github.com/unchain-tech/UNCHAIN-Projects",
          label: "GitHub",
          position: "right",
        },
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
              href: "https://github.com/facebook/docusaurus",
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
              label: "Twitter",
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
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

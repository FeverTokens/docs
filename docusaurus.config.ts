import path from "node:path";
import type {Config} from "@docusaurus/types";

const EDIT_URL_BASE = "https://github.com/FeverTokens/docs/edit/main";

const config: Config = {
	title: "Fever CLI documentation",
	tagline: "Guides to using Fevertokens",
	url: "https://docs.fevertokens.app",
	baseUrl: "/",
	favicon: "img/favicon.ico",
	organizationName: "FeverTokens", // Usually your GitHub org/user name.
	projectName: "feverGuides", // Usually your repo name.
	themeConfig: {
		colorMode: {
			defaultMode: "dark",
			disableSwitch: false,
			respectPrefersColorScheme: false,
		},
		navbar: {
			logo: {
				alt: "FeverTokens Logo",
				src: "img/logo.svg",
				href: "https://www.fevertokens.io/",
			},
			items: [
				{
					href: "https://github.com/FeverTokens",
					position: "right",
					className: "header-github-link",
					"aria-label": "GitHub repository",
				},
			],
		},
		footer: {
			style: "light",
			links: [
				// {
				//   title: 'Docs',
				//   items: [
				//     {
				//       label: 'Style Guide',
				//       to: 'docs/doc1',
				//     },
				//     {
				//       label: 'Second Doc',
				//       to: 'docs/doc2',
				//     },
				//   ],
				// },
				{
					title: "Community",
					items: [
						// {
						//   label: 'Stack Overflow',
						//   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
						// },
						{
							label: "Discord",
							href: "https://discord.com/invite/grmvvqUt88",
						},
						{
							label: "LinkedIn",
							href: "https://www.linkedin.com/company/fevertokens",
						},
						{
							label: "Twitter",
							href: "https://twitter.com/FeverTokens",
						},
					],
				},
				// {
				//   title: 'More',
				//   items: [
				//     {
				//       label: 'Blog',
				//       to: 'blog',
				//     },
				//     {
				//       label: 'GitHub',
				//       href: 'https://github.com/FeverTokens/feverGuides',
				//     },
				//   ],
				// },
			],
			copyright: `Copyright © ${new Date().getFullYear()} FeverTokens. All rights reserved.`,
		},
		docs: {
			sidebar: {
				hideable: true,
				autoCollapseCategories: true,
			},
		},
	},
	presets: [
		[
			"@docusaurus/preset-classic",
			{
				docs: false,
				blog: false,
				theme: {
					customCss: path.resolve(__dirname, "./src/css/custom.css"),
				},
			},
		],
	],
	plugins: [
		[
			"@docusaurus/plugin-content-docs",
			{
				id: "default",
				path: "docs",
				routeBasePath: "/",
				sidebarPath: path.resolve(__dirname, "./sidebars.ts"),
				sidebarCollapsible: true,
				sidebarCollapsed: false,
				editUrl: ({docPath}: {docPath: string}) =>
					`${EDIT_URL_BASE}/docs/${docPath}`,
			},
		],
		[
			"@signalwire/docusaurus-plugin-llms-txt",
			{
				siteTitle: "Fever CLI documentation",
				siteDescription: "Guides to using Fevertokens",
				depth: 2,
				content: {
					includeBlog: false,
					includePages: true,
					relativePaths: false,
					enableMarkdownFiles: false,
					enableLlmsFullTxt: true, // Optional: generates llms-full.txt
				},
			},
		],
	],
};

export default config;

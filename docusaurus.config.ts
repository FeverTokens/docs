import path from "node:path";
import type {Config} from "@docusaurus/types";

const config: Config = {
	title: "Fever CLI documentation",
	tagline: "Guides to using Fevertokens",
	url: "https://docs.fevertokens.io",
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
			// title: 'Guides',
			logo: {
				alt: "FeverTokens Logo",
				src: "img/logo.svg",
				href: "https://www.fevertokens.io/",
			},
			items: [
				{
					type: "docsVersionDropdown",
					position: "right",
					dropdownActiveClassDisabled: true,
					versions: {
						current: {
							label: "Latest",
						},
					},
				},
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
				docs: {
					routeBasePath: "/",
					sidebarPath: path.resolve(__dirname, "./sidebars.ts"),
					sidebarCollapsible: true,
					sidebarCollapsed: false,
					// Please change this to your repo.
					editUrl:
						"https://github.com/facebook/docusaurus/edit/master/website/",
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					editUrl:
						"https://github.com/facebook/docusaurus/edit/master/website/blog/",
				},
				theme: {
					customCss: path.resolve(__dirname, "./src/css/custom.css"),
				},
			},
		],
	],
};

export default config;

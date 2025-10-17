import type {SidebarsConfig} from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
	mainSidebar: [
		{
			type: "category",
			label: "🚀 Quickstart Guide",
			collapsible: false,
			collapsed: false,
			items: [
				"quickstart/introduction",
				"quickstart/getting-started",
				"quickstart/compile-deploy",
				"quickstart/diamond-proxy",
				"quickstart/troubleshooting",
			],
		},
	],
};

export default sidebars;

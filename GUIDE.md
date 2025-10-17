# Fever CLI Quickstart - Docusaurus Documentation

This folder contains the converted Fever CLI Quickstart documentation in Docusaurus-compatible markdown format.

## 📁 File Structure

```
fever-docs/
├── 01-introduction.md          # Installation and overview
├── 02-getting-started.md       # Authentication and project setup
├── 03-compile-deploy.md        # Compiling contracts and first deployment
├── 04-diamond-proxy.md         # Advanced multi-contract systems
├── 05-troubleshooting.md       # Common issues and solutions
├── sidebars-config.js          # Sidebar configuration example
└── README.md                   # This file
```

## 🚀 How to Use in Docusaurus

### Step 1: Copy Files to Your Docs Directory

Copy all markdown files (`.md`) to your Docusaurus docs directory:

```bash
cp *.md /path/to/your-docusaurus-project/docs/quickstart/
```

### Step 2: Update Sidebar Configuration

Add the sidebar configuration to your `sidebars.js` file:

```javascript
module.exports = {
	// Your existing sidebars...

	// Add the quickstart sidebar
	quickstartSidebar: [
		{
			type: "category",
			label: "🚀 Quickstart Guide",
			collapsed: false,
			items: [
				"quickstart/01-introduction",
				"quickstart/02-getting-started",
				"quickstart/03-compile-deploy",
				"quickstart/04-diamond-proxy",
				"quickstart/05-troubleshooting",
			],
		},
	],
};
```

Or integrate into an existing sidebar:

```javascript
module.exports = {
	tutorialSidebar: [
		"intro",
		{
			type: "category",
			label: "🚀 Quickstart",
			collapsed: false,
			items: [
				"quickstart/01-introduction",
				"quickstart/02-getting-started",
				"quickstart/03-compile-deploy",
				"quickstart/04-diamond-proxy",
				"quickstart/05-troubleshooting",
			],
		},
		// ... other items
	],
};
```

### Step 3: Configure Docusaurus (Optional)

If you want to customize the appearance, update your `docusaurus.config.js`:

```javascript
module.exports = {
	// ... other config
	themeConfig: {
		navbar: {
			items: [
				{
					type: "doc",
					docId: "quickstart/01-introduction",
					position: "left",
					label: "🚀 Quickstart",
				},
				// ... other items
			],
		},
	},
};
```

## ✨ Features Included

### 1. **Emoji Icons** 🎨

Each section uses appropriate emojis for visual appeal and easy navigation.

### 2. **Admonitions** 📝

The documentation uses Docusaurus admonitions for important information:

- `:::tip` - Pro tips and best practices
- `:::info` - General information and next steps
- `:::warning` - Important warnings
- `:::danger` - Critical security notes

### 3. **Code Blocks** 💻

All code examples include:

- Syntax highlighting
- Language specification (bash, yaml, solidity, etc.)
- File path titles where applicable

### 4. **Frontmatter Metadata** 📋

Each file includes proper frontmatter:

```yaml
---
title: Page Title
sidebar_position: 1
description: Page description for SEO
---
```

### 5. **Navigation Links** 🔗

Each page includes navigation to the next section using `:::info Next Steps` admonitions.

### 6. **Tables** 📊

Comparison tables are formatted using markdown tables (e.g., Deployment vs Diamond comparison).

## 🎨 Customization Options

### Change Emoji Icons

Simply replace the emojis in the titles:

```markdown
# 🚀 Quickstart

# 💎 Diamond Proxy Systems
```

### Adjust Sidebar Position

Modify the `sidebar_position` in the frontmatter:

```yaml
---
sidebar_position: 1 # Change this number
---
```

### Add More Admonitions

Docusaurus supports various admonition types:

```markdown
:::note
This is a note
:::

:::tip
This is a tip
:::

:::info
This is info
:::

:::caution
This is a caution
:::

:::danger
This is a danger warning
:::
```

### Custom Syntax Highlighting

You can add more language support in `docusaurus.config.js`:

```javascript
module.exports = {
	themeConfig: {
		prism: {
			theme: lightCodeTheme,
			darkTheme: darkCodeTheme,
			additionalLanguages: ["solidity", "yaml", "bash"],
		},
	},
};
```

## 🔧 Troubleshooting

### Links Not Working?

Make sure the file paths in the sidebar configuration match your actual file locations.

### Admonitions Not Rendering?

Verify that your Docusaurus version supports admonitions (v2.0+) and that you're using the correct syntax with three colons `:::`.

### Code Highlighting Issues?

Ensure the language identifier after the triple backticks is correct:

- `solidity` for Solidity code
- `yaml` for YAML configuration
- `bash` for shell commands

## 📚 Additional Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Docusaurus Markdown Features](https://docusaurus.io/docs/markdown-features)
- [Docusaurus Admonitions](https://docusaurus.io/docs/markdown-features/admonitions)
- [Fever CLI Documentation](https://cli.fevertokens.app/docs)

## 🤝 Contributing

Feel free to improve these docs by:

1. Adding more examples
2. Improving explanations
3. Adding diagrams or images
4. Fixing typos or errors

## example sidebar config

```
/**
 * Sidebar configuration for Fever CLI Quickstart
 * Add this to your sidebars.js file in Docusaurus
 */

module.exports = {
  quickstartSidebar: [
    {
      type: 'category',
      label: '🚀 Quickstart Guide',
      collapsed: false,
      items: [
        '01-introduction',
        '02-getting-started',
        '03-compile-deploy',
        '04-diamond-proxy',
        '05-troubleshooting',
      ],
    },
  ],
};
```

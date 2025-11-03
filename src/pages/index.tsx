import React, {useEffect} from "react";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const REDIRECT_TARGET = "/cli/intro";

export default function Home(): JSX.Element {
	const {siteConfig} = useDocusaurusContext();

	useEffect(() => {
		if (typeof window !== "undefined" && window.location.pathname !== REDIRECT_TARGET) {
			window.location.replace(REDIRECT_TARGET);
		}
	}, []);

	return (
		<Layout title={siteConfig.title} description={siteConfig.tagline}>
			<Head>
				<meta httpEquiv="refresh" content={`0; url=${REDIRECT_TARGET}`} />
			</Head>
			<main className="container margin-vert--lg">
				<div className="row">
					<div className="col col--8 col--offset-2">
						<h1 className="hero__title">{siteConfig.title}</h1>
						<p className="hero__subtitle">{siteConfig.tagline}</p>
						<p>
							If you are not redirected automatically, visit the{" "}
							<a href={REDIRECT_TARGET}>CLI introduction</a> to get started.
						</p>
					</div>
				</div>
			</main>
		</Layout>
	);
}

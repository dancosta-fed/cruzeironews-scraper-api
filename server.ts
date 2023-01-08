import axios from "axios";
import * as cheerio from 'cheerio';
import express from "express";
import cors from "cors";
import { Article } from "./types";

const app = express();
app.use(cors());

const port = process.env.PORT || 8008;
const cruzeiroArticles: Article[] = [];
const deusMeDibreArticles: Article[] = [];
const geGloboArticles: Article[] = [];

// API's home page
app.get("/", (req, res) => {
	res.status(200).send(
		`
			<div>
			  <h1>Cruzeiro Scraper API</h1>
				<p>Criado por Dan Costa...</p>
			</div>
		`
	);
})

// getting articles from Cruzeiro's website
app.get("/cruzeiro", async (req, res) => {
	const { key } = req.query;
	const cruzeiroUrl = "https://cruzeiro.com.br/noticias";

	if (!key) {
  	res.status(400).send(
			`
				<div>
					<h4>Please provide API KEY</h4>
				</div>
			`
		);
	} else {
		try {
			// Scrapping news from Cruzeiro's website
			const { data } = await axios.get(cruzeiroUrl)
			const $ = cheerio.load(data)
			const articleArray = $("#noticias > .nq-c-BlockBanner2Pushs4Thumbnails > .nq-u-hspace > .container > .row > .col");
			articleArray.map((id: any, element: any) => {

				const title = $(element).find("h4").text();
				const url = $(element).find("figure > a").attr("href");
				const thumbnail = $(element).find("figure > img").attr("src");
				const date = $(element).find(".date").text();

				cruzeiroArticles.push({
					id: id,
					title: title,
					thumbnail: `https://cruzeiro.com.br${thumbnail}`,
					url: `https://cruzeiro.com.br${url}`,
					publicado: date,
					portal: 'Cruzeiro',
				});
			})

			// sending the final array
			res.status(200).send(cruzeiroArticles);

		} catch (err: any) {
			console.error('Error on the endpoint /news/cruzeiro', err);
			res.status(500).send({message: err.message})
		}
	}
});

// getting cruzeiro's articles by id
app.get('/cruzeiro/:id', async (req, res) => {
	const { key } = req.query;
	const cruzeiroUrl = "https://cruzeiro.com.br/noticias";

	if (!key) {

		res.status(400).send(
			`
				<div>
					<h4>Please provide API KEY</h4>
				</div>
			`
		);

	} else {
		const article = cruzeiroArticles.find(article => article.id === parseInt(req.params.id));

		// if there is no article with the id
		if (!article) {
			return res.status(404).send(
				`
					<div>
						<h1>404</h1>
						<h3>The article with the given id does not exist</h3>
					</div>
				`
			)
		} else {
			const url_id = article.url;

			if (url_id) {
				const { data } = await axios.get(url_id);
				const $ = cheerio.load(data)

				return res.status(200).send($("figcaption > div").html());
			}
		}
	}
});

// getting articles from Deus Me Dibre's website
app.get("/deusmedibre", async (req, res) => {
	const { key } = req.query;
	const deusMeDibreUrl = "https://deusmedibre.com.br/cruzeiro/";

	if (!key) {
  	res.status(400).send(
			`
				<div>
					<h4>Please provide API KEY</h4>
				</div>
			`
		);
	} else {
		try {
			// Scrapping news from Cruzeiro's website
			const { data } = await axios.get(deusMeDibreUrl)
			const $ = cheerio.load(data)
			const articleArray = $("#todos-posts > article");

			articleArray.map((id: any, element: any) => {

				const title = $(element).find("h2").text();
				const url = $(element).find("a").attr("href");
				const thumbnail = $(element).find(".thumbnail > a > img").attr("src");
				const date = $(element).find(".post-date").text();
				const author = $(element).find(".post-author > a").text().replace(/(\n\t\t\t\t\t\t|\t\t\t\t\t)/gm, "");

				// Adding information to the array
				deusMeDibreArticles.push({
					id: id,
					title: title,
					thumbnail: thumbnail,
					url: url,
					publicado: date,
					author: author,
					portal: 'Deus Me Dibre',
				});
			})

			// sending the final array
			res.status(200).send(deusMeDibreArticles);

		} catch (err: any) {
			console.error('Error on the endpoint /news/cruzeiro', err);
			res.status(500).send({message: err.message})
		}
	}
});

// getting deusmedibre's articles by id
app.get('/deusmedibre/:id', async (req, res) => {
	const { key } = req.query;

	if (!key) {

		res.status(400).send(
			`
				<div>
					<h4>Please provide API KEY</h4>
				</div>
			`
		);

	} else {
		const article = deusMeDibreArticles.find(article => article.id === parseInt(req.params.id));

		// if there is no article with the id
		if (!article) {
			return res.status(404).send(
				`
					<div>
						<h1>404</h1>
						<h3>The article with the given id does not exist</h3>
					</div>
				`
			)
		} else {
			const url_id = article.url;
			console.log(url_id)
			if (url_id) {
				const { data } = await axios.get(url_id);
				const $ = cheerio.load(data)

				return res.status(200).send($(".conteudo-post").html());
			}
		}
	}
});


app.listen(port, () => console.log(`Server is running on ${port}...`));

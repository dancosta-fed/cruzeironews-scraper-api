import axios from "axios";
import * as cheerio from 'cheerio';
import express from "express";
import cors from "cors";
import { Article } from "./types";

const app = express();
app.use(cors());

const port = process.env.PORT || 8008;
const cruzeiroArticles: Article[] = [];

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
					post: '',
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

// getting articles by id
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
			console.log('URL', url_id)

			if (url_id) {
				const { data } = await axios.get(url_id);
				const $ = cheerio.load(data)
				return res.status(200).send($.html());
			}

			// res.status(200).send(article);
		}
	}
});



app.listen(port, () => console.log(`Server is running on ${port}...`));

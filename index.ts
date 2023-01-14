import axios from "axios";
import * as cheerio from 'cheerio';
import express from "express";
import * as bodyParser from 'body-parser';
import cors from "cors";
import { Article } from "./types";

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const port = process.env.PORT || 8000;
let cruzeiroArticles: Article[] = [];
let deusMeDibreArticles: Article[] = [];
let geGloboArticles: Article[] = [];
let onzeMinasArticles: Article[] = [];
let ID = 0;
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


const getHtml = async (url: string, website: string): Promise<string | null> => {

  const { data } = await axios.get(url);
  const $ = cheerio.load(data)

  const html = (): string | null => {
    switch (website) {
      case 'cruzeiro':
        return $("figcaption > div").html()
      case 'onzeMinas':
        return $(".conteudo-noticia").html()
      case 'deusMeDibre':
        return $(".conteudo-post").html()
      case 'geGlobo':
        return $("article").html()

      default:
        return ''
    }
  }
  return html()
}

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
			const articleArray = $("body > #noticias > .nq-c-BlockBanner2Pushs4Thumbnails > .nq-u-hspace > .container > .row > .col");
			cruzeiroArticles = []

			await Promise.all(articleArray.map(async (id: any, element: any) => {

				const title = $(element).find("h4").text();
				const url = $(element).find("figure > a").attr("href");
				const thumbnail = $(element).find("figure > img").attr("src");
				const date = $(element).find(".date").text();
        let html = ''

        // if (url)
        //   getHtml(`https://cruzeiro.com.br${url}`, 'cruzeiro')
				// 		.then((htmlData) => {
				// 			html = htmlData!
				// 		})
				// 		.catch((error) => console.error('html cruzeiro', error));
				try {
					if (url) {
						return html = await getHtml(`https://cruzeiro.com.br${url}`, 'cruzeiro') || '';
					}
				} catch (error) {
					console.error('htmlCruzeiro', error);
				}

				cruzeiroArticles.push({
					id: id + 10,
					title,
					thumbnail: `https://cruzeiro.com.br${thumbnail}`,
					url: `https://cruzeiro.com.br${url}`,
					publicado: date,
					portal: 'Cruzeiro',
					html
				});

			}))

			// sending the final array
			res.status(200).send(cruzeiroArticles);

		} catch (err: any) {
			console.error('Error on the endpoint /cruzeiro', err);
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
			deusMeDibreArticles = []

			await Promise.all(articleArray.map(async (id: any, element: any) => {

				const title = $(element).find("h2").text();
				const url = $(element).find("a").attr("href");
				const thumbnail = $(element).find(".thumbnail > a > img").attr("src");
				const date = $(element).find(".post-date").text();
				const author = $(element).find(".post-author > a").text().replace(/(\n\t\t\t\t\t\t|\t\t\t\t\t)/gm, "");
        let html = ''

        if (url)
          html = await getHtml(url, 'deusMeDibre') || '';

				// Adding information to the array
				deusMeDibreArticles.push({
					id: id + 20,
					title,
					thumbnail,
					url,
					publicado: date,
					author,
					portal: 'Deus Me Dibre',
          html
				});
			}))

			// sending the final array
			res.status(200).send(deusMeDibreArticles);

		} catch (err: any) {
			console.error('Error on the endpoint /deusMeDibre', err);
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
			if (url_id) {
				const { data } = await axios.get(url_id);
				const $ = cheerio.load(data)

				return res.status(200).send($(".conteudo-post").html());
			}
		}
	}
});

// getting articles from Ge Globo's website
app.get("/geglobo", async (req, res) => {
	const { key } = req.query;
	const geGloboUrl = "https://ge.globo.com/futebol/times/cruzeiro/"; // site Globo

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
			const { data } = await axios.get(geGloboUrl)
			const $ = cheerio.load(data)
			const articleArray = $(".bastian-page > ._evg > ._evt > .bastian-feed-item");
			// Clear array
			geGloboArticles = []

			await Promise.all(articleArray.map(async (id: any, element: any) => {

				const title = $(element).find("h2 > a").text();
				const url = $(element).find("a").attr("href");
				const thumbnail = $(element).find(".bstn-fd-picture-image").attr("src");
				const date = $(element).find(".feed-post-datetime").text();
        let html = ''

        if (url)
          html = await getHtml(url, 'geGlobo') || '';

				// Adding information to the array
				geGloboArticles.push({
					id: id + 30,
					title,
					thumbnail,
					url,
					publicado: date,
					portal: 'Globo',
          html
				});
			}))

			// sending the final array
			res.status(200).send(geGloboArticles);
		} catch (err: any) {
			console.error('Error on the endpoint /geglobo', err);
			res.status(500).send({message: err.message})
		}
	}
});

// getting Ge Globo's articles by id
app.get('/geglobo/:id', async (req, res) => {
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
		const article = geGloboArticles.find(article => article.id === parseInt(req.params.id));

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

				return res.status(200).send($("article").html());
			}
		}
	}
});

// getting articles from Ge Globo's website
app.get("/onzeminas", async (req, res) => {
	const { key } = req.query;
	const onzeMinasUrl = "https://onzeminas.com.br/portal/noticias/cruzeiro/"; // site Onze Minas

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
			const { data } = await axios.get(onzeMinasUrl)
			const $ = cheerio.load(data)
			const articleArray = $("article");
			onzeMinasArticles = [];

			await Promise.all(articleArray.map(async (id: any, element: any) => {

				const title = $(element).find("h2").text();
				const url = $(element).find("a").attr("href");
				const thumbnail = $(element).find("img").attr("src");

        let html = ''

        if (url)
          html = await getHtml(url, 'onzeMinas') || '';

				// Adding information to the array
				onzeMinasArticles.push({
					id: id + 40,
					title,
					thumbnail,
					url,
					portal: 'Onze Minas',
          html
				});
			}))

			// sending the final array
			res.status(200).send(onzeMinasArticles);

		} catch (err: any) {
			console.error('Error on the endpoint /onzeminas', err);
			res.status(500).send({message: err.message})
		}
	}
});

// getting Ge Globo's articles by id
app.get('/onzeminas/:id', async (req, res) => {
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
		const article = onzeMinasArticles.find(article => article.id === parseInt(req.params.id));

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

				return res.status(200).send($(".conteudo-noticia").html());
			}
		}
	}
});

app.listen(port, () => console.log(`Server is running on ${port}...`));

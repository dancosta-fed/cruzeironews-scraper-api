import * as cheerio from "cheerio";
import rp from "request-promise";



const getHtml = async (url: string, website: string): Promise<string | null> => {
    console.log('=======================================================================================') 
    const options: {
        uri: string;
        transform: (body: string) => cheerio.Root;
      } = {
        uri: url,
        transform: (body: string) => cheerio.load(body),
      };
     
    const $ = await rp(options);
  
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

  export default getHtml
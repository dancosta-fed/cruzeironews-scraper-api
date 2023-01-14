export interface Article {
	id?: number;
  title?: string;
  thumbnail?: string | undefined;
  url?: string;
  publicado?: string;
	author?: string;
	portal?: string;
	post?: string;
  html: string | undefined
}

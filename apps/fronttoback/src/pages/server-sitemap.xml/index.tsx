import {getServerSideSitemap} from 'next-sitemap'
import {GetServerSideProps} from 'next'
import {getAllArticles} from 'lib/articles'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  // load content that we want to add to the sitemap here
  const articles = await getAllArticles()

  return getServerSideSitemap(ctx, [
    ...articles.map((article: any) => {
      const date = article.date
        ? new Date(article.date).toISOString()
        : new Date().toISOString()
      return {
        loc: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`, // Absolute url
        lastmod: date,
        changefreq: 'weekly',
        priority: 0.7,
      }
    }),
  ])
}

// Default export to prevent next.js errors
export default function SitemapIndex() {}

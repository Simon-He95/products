import Layout from 'components/app/layout'
import {getOgImage} from 'utils/get-og-image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

const NewsletterPage = () => {
  const title = 'Newsletter'
  const ogImage = getOgImage(title)

  return (
    <Layout meta={{title, ogImage}} className="w-full">
      <main className="w-full mx-auto flex flex-grow h-full pt-32 items-center flex-col justify-center">
        <PrimaryNewsletterCta />
      </main>
    </Layout>
  )
}

export default NewsletterPage

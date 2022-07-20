import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: '/privacy',
      permanent: true,
    },
  }
}

// Default export to prevent next.js errors
export default function TermsPage() {}
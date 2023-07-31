import LandingPage from '@/components/pagesComponents/homepage/LandingPage';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { PAGE_PATHS } from 'seoUtils/pages.routes';
import { getMetaTags } from 'seoUtils/seo.helpers';

export async function generateMetadata(): Promise<Metadata> {

  const getResponse = await getMetaTags(PAGE_PATHS.home);
  return getResponse;
}

export default async function Page() {
  let featuredProfilesData;
  let publicQuestionsData;
  let talentTypesData;

  const promise = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/profile?isFeatured=true&all=true`,
      {
        headers: {
          cookie: (headers().get('cookie') as string) || '',
        },
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/questions?isPublic=true&all=true`,
      {
        headers: {
          cookie: (headers().get('cookie') as string) || '',
        },
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/profileTypes?all=true`,
      {
        headers: {
          cookie: (headers().get('cookie') as string) || '',
        },
      }
    ),
  ]);

  featuredProfilesData = await promise[0]?.json();
  publicQuestionsData = await promise[1]?.json();
  talentTypesData = await promise[2]?.json();

  return (
    <LandingPage
      featuredProfiles={featuredProfilesData?.data || []}
      publicQuestions={publicQuestionsData?.data || []}
      talentTypes={talentTypesData?.data || []}
    />
  );
}

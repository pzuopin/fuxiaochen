import { PATHS } from '@/config';

import { PageHeader } from '@/components/page-header';

import { BlogList, getPublishedBlogs } from '@/features/blog';

export const revalidate = 60;

export default async function Page() {
  const { blogs } = await getPublishedBlogs();

  return (
    <div className="w-full flex flex-col justify-center px-6 md:max-w-screen-md  2xl:max-w-6xl  md:mx-auto pb-24 pt-8">
      <PageHeader breadcrumbList={[PATHS.SITE_HOME, PATHS.SITE_BLOG]} />

      <BlogList blogs={blogs} />
    </div>
  );
}
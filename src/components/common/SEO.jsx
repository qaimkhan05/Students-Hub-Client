import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title} | Student Hub Pakistan</title>
      <meta name="description" content={description || 'A simple digital resources platform for Pakistani students.'} />
      <meta name="keywords" content={keywords || 'students, pakistan, notes, projects, digital resources'} />
      <meta property="og:title" content={`${title} | Student Hub Pakistan`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;

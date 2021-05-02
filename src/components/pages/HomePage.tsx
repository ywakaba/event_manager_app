import React from 'react';
import GenericTemplate from "../templates/GenericTemplate";

const HomePage: React.FC = () => {
  return (
    <GenericTemplate title="トップページ" maxWidth="lg">
      <>工事中</>
    </GenericTemplate>
  );
};

export default HomePage;
import React from "react";
import { useTranslation } from "react-i18next";
import { useHost } from "@learlifyweb/providers.host";

import { alias } from "@lang";

import { Container, Content, GreetText, WishText, smile } from "./styles";

const Dashboard: React.FC = () => {
  const { user } = useHost();

  const { t } = useTranslation();

  return (
    <Container>
      <Content>
        <GreetText>
          {t(alias["dashboard.welcome"], { user: user?.first_name })}
          <i className={smile}></i>
        </GreetText>
        <WishText>Have a good day!</WishText>
      </Content>
    </Container>
  );
};

export default Dashboard;

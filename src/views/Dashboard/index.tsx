import React from "react";
import { useTranslation } from "react-i18next";

import { alias } from "@lang";

import { Container, Content, GreetText, WishText } from "./styles";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Content>
        <GreetText>
          {t(alias["dashboard.welcome"], { user: "Anderson" })}
        </GreetText>
        <WishText>Have a good day!</WishText>
      </Content>
    </Container>
  );
};

export default Dashboard;

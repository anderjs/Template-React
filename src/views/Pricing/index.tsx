import React from "react";
import styled from "styled-components";

import { useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";

import { Loading } from "@learlifyweb/providers.loading";
import { httpsClient } from "@learlifyweb/providers.https";

import { PlanQuery } from "@query";

import {
  Color,
  styles,
  Container,
  StyledCard,
  StyledIcon,
  StyledPrice,
  StyledTitle,
  StyledButton,
  StyledOptions,
  StyledSection,
} from "./styles";

// - Interface
import { IPlan, IPricing } from "./api/interface";

// - API
import { request } from "./api";

const Pricing: React.FC = () => {
  const { token } = useHost();

  const plans = useQuery({
    queryKey: [PlanQuery.DATA],
    queryFn: httpsClient<IPlan[]>({ token }, request.pricing),
  });

  return (
    <Loading>
      <Container>Pricing</Container>
      <StyledSection>
        <StyledCard className="grid justify-items-start">
          <StyledIcon className="fa justify-self-center fa fa-chalkboard" />
          <StyledTitle className="justify-self-center">LITE</StyledTitle>
          <StyledPrice className="justify-self-center">
            <h4>
              $10/<span className="text-2xl">Month</span>
            </h4>
          </StyledPrice>
          <StyledOptions className="justify-self-center">
            <ul>
              <li>
                <i className="fa fa-check" />
                <span>1 GB Space</span>
              </li>
              <li>
                <i className="fa fa-check" />
                <span>Live Support</span>
              </li>
              <li>
                <i className="fa fa-check" />
                <span>AI Assistant</span>
              </li>
            </ul>
          </StyledOptions>
          <br />
          <div className="justify-self-center">
            <StyledButton>Start now</StyledButton>
          </div>
        </StyledCard>
      </StyledSection>
    </Loading>
  );
};

export default Pricing;

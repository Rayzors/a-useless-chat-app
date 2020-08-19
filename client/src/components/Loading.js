import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Loading = () => (
  <LoadingContainer>
    <p>Nous sommes à la recherche d'une personne...</p>
  </LoadingContainer>
);

export default Loading;

import React from 'react';
import styled from 'styled-components';

const Bull = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${({ position }) =>
    position === 'left' ? 'flex-start' : 'flex-end'};
  margin-bottom: 0.5em;

  & div {
    max-width: 70%;
    padding: 1em;
    border-radius: 20px;
    background: ${({ position }) => (position === 'left' ? '#ddd' : '#126dff')};
    color: ${({ position }) => (position === 'left' ? '#1A1A1A' : '#fff')};
  }
`;

const Row = ({ content, position }) => {
  return (
    <Bull position={position}>
      <div>{content}</div>
    </Bull>
  );
};

export default Row;

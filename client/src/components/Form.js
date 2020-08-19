import React from 'react';
import styled from 'styled-components';
import Container from './Container.js';

const Form = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 1em;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);

  & input {
    border-radius: 20px;
    padding: 1em;
    width: 100%;
    border: 1px solid #eee;

    &:focus {
      outline: none;
      border: 1px solid #126dff;
    }
  }
`;

const StyledForm = ({ value, onChange, onKeyPress, onKeyUp }) => {
  return (
    <Form>
      <Container>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onKeyUp={onKeyUp}
          placeholder="Enter your message here"
        />
      </Container>
    </Form>
  );
};

export default StyledForm;

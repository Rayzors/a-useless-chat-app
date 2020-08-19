import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Container from './components/Container.js';
import Form from './components/Form.js';
import Row from './components/Row.js';
import socket from './socket.js';
import debounce from 'lodash.debounce';

const ADD_MESSAGE = gql`
  mutation addMessage($author: String!, $content: String!) {
    addMessage(data: { author: $author, content: $content }) {
      author
      content
      date
    }
  }
`;
const GET_MESSAGES = gql`
  query getMessages {
    messages {
      content
      author
      date
    }
  }
`;

function position(name) {
  return name === 'User 2' ? 'left' : 'right';
}

function App() {
  const { loading, error, data } = useQuery(GET_MESSAGES);
  const [value, setValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const onChange = (e) => setValue(e.target.value);
  const [addMessage] = useMutation(ADD_MESSAGE);

  useEffect(() => {
    socket.on('connect', function () {
      console.log('connexion');
    });

    socket.on('writing', (typing) => {
      setIsTyping(typing);
    });
  }, []);

  const onKeyPress = (e) => {
    socket.emit('start-writing', true);

    if (e.keyCode !== 13) return;

    addMessage({ variables: { author: 'Kevin', content: value } });
    setValue('');
  };

  const keyUpDebounced = useMemo(
    () => debounce(() => socket.emit('stop-writing', false), 500),
    []
  );

  const onKeyUp = useCallback((e) => keyUpDebounced(), [keyUpDebounced]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container>
      <header className="App-header">
        <h1>Anonymous chat</h1>
      </header>

      <div>
        {data.messages &&
          data.messages.map(({ content, author, date }, i) => (
            <Row
              key={`${date}_${i}`}
              content={content}
              position={position(author)}
            />
          ))}
      </div>

      {isTyping && <p>Votre correspondant est entrain d'écrire...</p>}
      <Form
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
      />
    </Container>
  );
}

export default App;

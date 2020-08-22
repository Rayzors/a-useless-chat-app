import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from './components/Container.js';
import Form from './components/Form.js';
import Header from './components/Header.js';
import Loading from './components/Loading.js';
import Row from './components/Row.js';
import ThreadContainer from './components/ThreadContainer.js';
import socket from './socket.js';

function App() {
  const [me, setMe] = useState('');
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    socket.on('id', function (id) {
      setMe(id);
    });

    socket.on('start-waiting', () => {
      setIsWaiting(true);
    });

    socket.on('end-waiting', () => {
      setIsWaiting(false);
    });

    socket.on('writing', (typing) => {
      setIsTyping(typing);
    });

    socket.on('update-messages', (messages) => {
      setMessages(messages);
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 100,
        behavior: 'smooth',
      });
    });
  }, []);

  const position = (name) => (name === me ? 'right' : 'left');

  const onKeyPress = (e) => {
    socket.emit('start-writing', true);

    if (e.which !== 13) return;
    socket.emit('send-message', value);
    setValue('');
  };

  const keyUpDebounced = useMemo(
    () => debounce(() => socket.emit('stop-writing', false), 500),
    []
  );

  const onKeyUp = useCallback((e) => keyUpDebounced(), [keyUpDebounced]);

  const onChange = (e) => setValue(e.target.value);

  if (isWaiting) return <Loading />;

  return (
    <Container>
      <Header>
        <h1>Dummy Tchat</h1>
      </Header>

      <ThreadContainer>
        {messages.length > 0 &&
          messages.map(({ content, author, date }, i) => (
            <Row
              key={`${date}_${i}`}
              content={content}
              position={position(author)}
            />
          ))}
      </ThreadContainer>

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

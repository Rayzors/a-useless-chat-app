const { gql } = require('apollo-server-express');

module.exports = gql`
  type Message {
    author: String
    content: String
    date: String
  }

  input MessageInput {
    author: String
    content: String
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    addMessage(data: MessageInput): Message
  }
`;

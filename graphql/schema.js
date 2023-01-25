const { gql } = require("apollo-server");

const typeDefs = gql`
  type RTCToken {
    token: String
    channel: String
  }
  type AccessToken {
    token: String
    userId: String
  }
  enum TokenRole {
    publisher
    subscriber
  }
  input rtcTokenInput {
    channel: String!
    tokenRole: TokenRole!
    expireTimeMs: Int!
  }
  type Query {
    hello: String
  }
  type Mutation {
    getRTCToken(rtcToken: rtcTokenInput): RTCToken
    getAccessToken(userId: String): AccessToken
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = {
  typeDefs,
};

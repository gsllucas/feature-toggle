const typeDefs = `#graphql
  enum Stack {
    FRONTEND
    BACKEND
  }

  type Feature {
    feature: String
    available: Boolean
    availableAt: String
    disabledAt: String
  }

  input FeatureInput {
    feature: String!
    available: Boolean!
  }

  input GetFeaturesFilter {
    available: Boolean!
  }

  type Query {
    feature(feature: String!): Feature,
    features(filter: GetFeaturesFilter): [Feature]
  }

  type Mutation {
    createFeature(input: FeatureInput!): Feature,
    updateFeature(input: FeatureInput!): Feature,
    removeFeature(feature: String!): Boolean!,
  }
`;

export default typeDefs;

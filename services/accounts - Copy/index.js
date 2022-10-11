const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];

const phones = [
  {id: "1", merek: "Samsung A31",  user_id: "2", supplier_id: "1"},
  {id: "2", merek: "Samsung A32",  user_id: "2", supplier_id: "2"},
  {id: "3", merek: "Samsung A311",  user_id: "1", supplier_id: "1"},
]

const suppliers = [
  {
    id: "1",
    name: "Supp1",
  },
  {
    id: "2",
    name: "Supp2",
  }
];



const typeDefs = gql`
  type Mutation {
    createUser(id: String, name: String, birthDate: String, username: String): String
  }

  type Query {
    users: [User]
    user(id: String!): User
    
    phones: [Phone]
    phone(id: String!, hello: String): Phone

    suppliers: [Supplier]
  }

  type User {
    id: ID!
    name: String
    username: String
    birthDate: String
    phones: [Phone]
    phone(id: String!): Phone
  }

  type Supplier {
    id: ID!
    name: String!
    phones: [Phone]
    customers: [User]
  }

  type Phone {
    id: ID!
    merek: String
    user: User!
    supplier: Supplier!
  }
`;

const resolvers = {
  // Mutation: {
  //   createUser(_, args){
  //     return `Created user with username ${args.username}`
  //   }
  // },
  Query: {
    users(){
      console.log(users)
      return users
    },
    user(_, args){
      return users.find(user => user.id === args.id);
    },
    phones(){
      return phones
    },
    phone(awdasdwdadasd, agadawdasdawd){
      return phones.find(phone => phone.id == agadawdasdawd.id)
    },
    suppliers(){
      return suppliers
    }
  },
  User: {
    phones(parent){
      return phones.filter(phone => phone.user_id == parent.id)
    },
    phone(parent, args){
      const user_phone = phones.filter(phone => phone.user_id == parent.id)
      return user_phone.find(phone => phone.id == args.id)
    },
  },
  Phone: {
    user(parent){
      return users.find(user => user.id == parent.user_id)
    },
    supplier(parent){
      return suppliers.find(supplier => supplier.id == parent.supplier_id)
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

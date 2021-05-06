import { gql, ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache({})
const client = new ApolloClient({
  cache
})

cache.policies.addTypePolicies({
  Query: {
    fields: {
      foo: {
        read: () => ({ bar: 'bar' })
      }
    }
  }
})

;(async () => {
  console.log(
    'bug',
    (await client.query({
      query: gql`
        fragment FooFragment on Foo {
          bar
        }
        query GetApps {
          foo @client {
            ...FooFragment
          }
        }
      `
    })).data.foo
  )
  
  console.log(
    'correct behavior',
    (await client.query({
      query: gql`
        fragment FooFragment on Foo {
          bar
        }
        query GetApps {
          foo @client {
            bar
          }
        }
      `
    })).data.foo
  )
})()

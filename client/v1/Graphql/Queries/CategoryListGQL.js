import gql from 'graphql-tag';

const CATEGORY_LIST_GQL = (
  before = '', after = '', first = 1, last = 1, name = '', name_Icontains = '', name_Istartswith = '', description_Icontains = '', description_Istartswith = ''
) => ({
  query: gql`
    query(
      $before: String,
      $after: String,
      $first: Int,
      $last: Int,
      $name: String
      $name_Icontains: String
      $name_Istartswith: String
      $description_Icontains: String
      $description_Istartswith: String
    ){
      categoryList(
        before: $before
        after: $after
        first: $first
        last: $last
        name: $name
        name_Icontains: $name_Icontains
        name_Istartswith: $name_Istartswith
        description_Icontains: $description_Icontains
        description_Istartswith: $description_Istartswith
      ){
        pageInfo{
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges{
          node{
            createdAt
            updatedAt
            id
            name
            featuredImage description
            events{
              edges{
                node{
                  id
                  title
                }
              }
            }
            interestSet{
              edges{
                node{
                  followerCategory{
                    name
                    featuredImage
                    description
                  }
                }
              }
            }
          }
          cursor
        }
      }
    }`,
  variables: {
    before,
    after,
    first,
    last,
    name,
    name_Icontains,
    name_Istartswith,
    description_Icontains,
    description_Istartswith,
  },
});

export default CATEGORY_LIST_GQL;

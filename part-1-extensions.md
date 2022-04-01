# Part 1 Extensions

## Extension 1

Update the `GET /pets` API you implemented in part 1 to support paging using the following additional parameters. You will need to use [LIMIT](https://www.postgresql.org/docs/9.3/queries-limit.html) and [OFFSET](https://www.postgresql.org/docs/9.3/queries-limit.html) in your calls to the database.

| Parameter  | Value  | Required | Description                                                                                                          |
| ---------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `page`     | Number | No       | The page number to return. Should default to 1 if not provided.                                                      |
| `per_page` | Number | No       | The number of records to return per page. Maximum should be 50, minimum is 10. Should default to 20 if not provided. |

## Extension 2

So far we've been including all our database code directly in our route handlers. In a real application, this is considered bad practice. It would become difficult to maintain as the code base grows, and we are also mixing concerns. We have routing code, request/response handling and database access all in a single function. This leads to tight coupling and low cohesion.

It is better practice to split your code into different _layers_. This helps keep our code decoupled. Rather than your route handler implementing all your logic, you can introduce controller functions that handle your routes as well as specific functions for calling the database. There is no single "correct" approach, but here are some examples:

- [MDN Express controllers and routes](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes)
- [Express REST API structure](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way)

There is also an example boolean repository that provides a suggested structure:

- [API Express Architecture](https://github.com/boolean-uk/api-express-architecture-example)

Update your implementation to match the structure of the above repo. Controllers functions should handle your requests and responses, and repository functions should handle your database access.

## Extension 3

Update your `POST /pets` endpoint to validate the json provided in the request body. If any field is missing, or has an invalid type or length, return an appropriate error message and response code to the client.

Update your `GET /pets/:id` to return an error if the provided pet Id does not exist.

You can implement this logic yourself, or use another library such as [express validator](https://express-validator.github.io/docs/).

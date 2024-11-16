### add your json to db.json

### add route to routes.json

### start mock server from project folder

    npm run mock

### Add custom routes

Create a routes.json file. Pay attention to start every route with /.

    {
      "/api/*": "/$1",
      "/:resource/:id/show": "/:resource/:id",
      "/posts/:category": "/posts?category=:category",
      "/articles\\?id=:id": "/posts/:id"
    }

Start JSON Server with --routes option.

    json-server db.json --routes routes.json

Now you can access resources using additional routes.

    /api/posts # → /posts
    /api/posts/1  # → /posts/1
    /posts/1/show # → /posts/1
    /posts/javascript # → /posts?category=javascript
    /articles?id=1 # → /posts/1

### Routes

Based on the previous db.json file, here are all the default routes. You can also add other routes using --routes.

### Plural routes

    GET    /posts
    GET    /posts/1
    POST   /posts
    PUT    /posts/1
    PATCH  /posts/1
    DELETE /posts/1

### Singular routes

    GET    /profile
    POST   /profile
    PUT    /profile
    PATCH  /profile

### Filter

Use . to access deep properties

    GET /posts?title=json-server&author=typicode
    GET /posts?id=1&id=2
    GET /comments?author.name=typicode

### Paginate

Use \_page and optionally \_limit to paginate returned data.
In the Link header you'll get first, prev, next and last links.

    GET /posts?_page=7
    GET /posts?_page=7&_limit=20

### 10 items are returned by default

### Sort

### Add \_sort and \_order (ascending order by default)

    GET /posts?_sort=views&_order=asc
    GET /posts/1/comments?_sort=votes&_order=asc

### For multiple fields, use the following format:

    GET /posts?_sort=user,views&_order=desc,asc

### Slice

### Add \_start and \_end or \_limit (an X-Total-Count header is included in the response)

    GET /posts?_start=20&_end=30
    GET /posts/1/comments?_start=20&_end=30
    GET /posts/1/comments?_start=20&_limit=10

### Works exactly as Array.slice (i.e. \_start is inclusive and \_end exclusive)

### Operators

### Add \_gte or \_lte for getting a range

    GET /posts?views_gte=10&views_lte=20

### Add \_ne to exclude a value

    GET /posts?id_ne=1

### Add \_like to filter (RegExp supported)

    GET /posts?title_like=server

###Full-text search
Add q

    GET /posts?q=internet

### Relationships

### To include children resources, add \_embed

    GET /posts?_embed=comments
    GET /posts/1?_embed=comments

### To include parent resource, add \_expand

    GET /comments?_expand=post
    GET /comments/1?_expand=post

### To get or create nested resources (by default one level, add custom routes for more)

    GET  /posts/1/comments
    POST /posts/1/comments

### Database

    GET /db

### Also when doing requests, it's good to know that:

1. If you make POST, PUT, PATCH or DELETE requests, changes will be automatically and safely saved to db.json using lowdb.
2. Your request body JSON should be object enclosed, just like the GET output. (for example {"name": "Foobar"})
3. Id values are not mutable. Any id value in the body of your PUT or PATCH request will be ignored. Only a value
   set in a POST request will be respected, but only if not already taken.
4. A POST, PUT or PATCH request should include a Content-Type: application/json header to use the JSON in the
   request body. Otherwise it will return a 2XX status code, but without changes being made to the data.

### CLI usage

    json-server [options] <source>

    Options:
      --config, -c       Path to config file           [default: "json-server.json"]
      --port, -p         Set port                                    [default: 3000]
      --host, -H         Set host                             [default: "localhost"]
      --watch, -w        Watch file(s)                                     [boolean]
      --routes, -r       Path to routes file
      --middlewares, -m  Paths to middleware files                           [array]
      --static, -s       Set static files directory
      --read-only, --ro  Allow only GET requests                           [boolean]
      --no-cors, --nc    Disable Cross-Origin Resource Sharing             [boolean]
      --no-gzip, --ng    Disable GZIP Content-Encoding                     [boolean]
      --snapshots, -S    Set snapshots directory                      [default: "."]
      --delay, -d        Add delay to responses (ms)
      --id, -i           Set database id property (e.g. _id)         [default: "id"]
      --foreignKeySuffix, --fks  Set foreign key suffix, (e.g. _id as in post_id)
                                                                     [default: "Id"]
      --quiet, -q        Suppress log messages from output                 [boolean]
      --help, -h         Show help                                         [boolean]
      --version, -v      Show version number                               [boolean]

    Examples:
      json-server db.json
      json-server file.js
      json-server http://example.com/db.json

    https://github.com/typicode/json-server

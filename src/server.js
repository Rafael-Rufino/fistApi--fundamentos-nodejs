const http = require("http");
const { URL } = require("url");

const routes = require("./routes");

const bodyParse = require("./helpers/bodyParse");

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3333${request.url}`);

  let { pathname } = parsedUrl;
  let id = null;

  const slintEndpoint = pathname.split("/").filter(Boolean);

  if (slintEndpoint.length > 1) {
    pathname = `/${slintEndpoint[0]}/:id`;
    id = slintEndpoint[1];
  }

  const route = routes.find(
    (routeObj) =>
      routeObj.endpoint === pathname && routeObj.method === request.method
  );

  if (route) {
    request.params = { id };
    request.query = Object.fromEntries(parsedUrl.searchParams);

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { "Content-Type": "application/json" });
      response.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      bodyParse(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Route not found" }));
  }
});

const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(`🔥 Server started at http://localhost:${port}`);
});

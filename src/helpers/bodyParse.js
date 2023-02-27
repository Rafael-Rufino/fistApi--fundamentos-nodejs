function bodyParse(request, callback) {
  let body = "";

  request.on("data", function (chunk) {
    body += chunk;
  });

  request.on("end", function () {
    body = JSON.parse(body);
    request.body = body;
    callback();
  });
}

module.exports = bodyParse;

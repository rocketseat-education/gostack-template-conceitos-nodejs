const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json({ repositories });
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  repositories.push({
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  });
  
  return response.status(201).json();
});

app.put("/repositories/:id", (request, response) => {
  const { id } =  request.params;
  const { title, url, techs } = request.body;

  const repository = repositories[repositories.findIndex(repository => repository.id === id)];

  if (title) {
    repository.title = title;
  }

  if (url) {
    repository.url = url;
  }

  if (techs) {
    repository.techs = techs;
  }

  response.json({repository})
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositories.splice(id, 1);

  return response.json();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;

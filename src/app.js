const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const index = repositories.push({
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0
  });

  const repository = repositories.find(element => element = index);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } =  request.params;
  const { title, url, techs } = request.body;

  const repository = repositories[repositories.findIndex(repository => repository.id === id)];

  if (!repository) {
    return response.status(400).json();
  }

  if (title) {
    repository.title = title;
  }

  if (url) {
    repository.url = url;
  }

  if (techs) {
    repository.techs = techs;
  }

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const isDeleted = repositories.splice(id, 1);

  return isDeleted.length > 0 
  ? response.status(204).json()
  : response.status(400).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories[repositories.findIndex(repository => repository.id === id)];

  if (!repository) {
    return response.status(400).json();
  }

  repository.likes +=1;

  return response.json(repository);
});

module.exports = app;

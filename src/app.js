const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function isId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: "Invalid ID" })
  }

  return next();

}

function labelLog(request, response, next){
  const { method, url } = request;

  label = `  ${method.toUpperCase()} ${url}`;
  console.time(label);
  next()
  console.timeEnd(label);

}

app.use(express.json());
app.use(cors());
app.use(labelLog)
app.use("/repositories/:id", isId)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository ={
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = 
    repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){ 
    return response.status(404).json({ error: "Repository not found" });
  }
  
  const repository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json( repository );

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = 
    repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){ 
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = 
    repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){ 
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;

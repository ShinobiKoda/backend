const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const dataFilePath = path.join(__dirname, "jobs.json");

// Read data from JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Get all jobs
app.get("/api/jobs", (req, res) => {
  const data = readData();
  res.json(data);
});

// Get job by ID
app.get("/api/jobs/:id", (req, res) => {
  const data = readData();
  const job = data.find((j) => j.id === parseInt(req.params.id, 10));
  if (job) {
    res.json(job);
  } else {
    res.status(404).send("Job not found");
  }
});

// Create new job
app.post("/api/jobs", (req, res) => {
  const data = readData();
  const newJob = { id: Date.now(), ...req.body };
  data.push(newJob);
  writeData(data);
  res.status(201).json(newJob);
});

// Update job by ID
app.put("/api/jobs/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex((j) => j.id === parseInt(req.params.id, 10));
  if (index !== -1) {
    data[index] = { id: parseInt(req.params.id, 10), ...req.body };
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).send("Job not found");
  }
});

// Delete job by ID
app.delete("/api/jobs/:id", (req, res) => {
  const data = readData();
  const newData = data.filter((j) => j.id !== parseInt(req.params.id, 10));
  writeData(newData);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

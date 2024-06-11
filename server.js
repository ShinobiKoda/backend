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

// Get job by ID
app.get("/api/jobs/:id", (req, res) => {
  const data = readData();
  const job = data.jobs.find((j) => j.id === req.params.id); // ID as string
  if (job) {
    res.json(job);
  } else {
    res.status(404).send("Job not found");
  }
});

app.get("/api/jobs", (req, res) => {
  const { _limit } = req.query;
  const data = readData();
  let jobs = data.jobs;

  if (_limit) {
    jobs = jobs.slice(0, Number(_limit));
  }

  res.json({ jobs });
});

// Create new job
app.post("/api/jobs", (req, res) => {
  try {
    const data = readData();
    const newJob = { id: Date.now(), ...req.body };
    data.push(newJob);
    writeData(data);
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating new job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update job by ID
app.put("/api/jobs/:id", (req, res) => {
  const data = readData();
  const index = data.jobs.findIndex((j) => j.id === req.params.id); // ID as string
  if (index !== -1) {
    data.jobs[index] = { id: req.params.id, ...req.body };
    writeData({ jobs: data.jobs });
    res.json(data.jobs[index]);
  } else {
    res.status(404).send("Job not found");
  }
});
// Delete job by ID
app.delete("/api/jobs/:id", (req, res) => {
  const data = readData();
  const newData = data.jobs.filter((j) => j.id !== req.params.id); // ID as string
  writeData({ jobs: newData });
  res.status(204).send();
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

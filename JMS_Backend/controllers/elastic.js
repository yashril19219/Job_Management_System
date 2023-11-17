const { Client } = require('@elastic/elasticsearch');
const connectDB = require('../connections/mongodb');
require('dotenv').config({path : "config/.env"});
const Job=require('../models/job');
const client = new Client({ node: 'http://localhost:9200',
auth:{
  username:"elastic",
  password:"root"
} }); // Your Elasticsearch endpoint

// Create index for Job model in Elasticsearch
async function createJobIndex() {
  await client.indices.create({
    index: 'jobs',
    body: {
      mappings: {
        properties: {
          title: { type: 'text' },
          description: { type: 'text' },
          status: { type: 'keyword' }
        }
      }
    }
  });
}

async function deleteJobIndex() {
  try {
    await client.indices.delete({ index: 'jobs' });
    console.log('Job index deleted');
  } catch (error) {
    console.error('Error deleting job index:', error);
  }
}

async function mapDataToIndex(){
  connectDB(process.env.MONGODB_CONNECTION_URL);

  const jobs= await Job.find();

  console.log(jobs);

  jobs.forEach(async (job) => {
    console.log(job.title);

    try {
      await client.index({
        index: 'jobs',
        id: job._id, // Use JobID as the document ID
        body: {
          title: job.title,
          description: job.description,
          status: job.status,
        }
      });
      console.log(`Job with JobID ${job._id} added to Elasticsearch`);
    } catch (error) {
      console.error('Error adding job to Elasticsearch:', error);
    }
  });
}


async function search(query){
  try{
    const body  = await client.search({
      index: 'jobs',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'description'],
            type: 'best_fields'
          }
        }
      }
    });
    console.log(body.hits.hits);

    return {status:true,data:body.hits.hits};
  }
  catch(error){
    console.log('Error: ',error);
  }

  return {status:false};
  
}

async function addToIndex(job){
  try {
    await client.index({
      index: 'jobs',
      id: job._id, // Use JobID as the document ID
      body: {
        title: job.title,
        description: job.description,
        status: job.status,
      }
    });
    console.log(`Job with JobID ${job._id} added to Elasticsearch`);
  } catch (error) {
    console.error('Error adding job to Elasticsearch:', error);
  }
}


async function deleteJobById(jobId) {
  try {
    const { body } = await client.delete({
      index: 'jobs',
      id: jobId
    });

    console.log(`Deleted document with ID ${jobId}`);
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`Document with ID ${jobId} not found`);
    } else {
      console.error(`Error deleting document with ID ${jobId}:`, error);
    }
  }
}


async function updateJobById(jobId, updatedFields) {
  try {
    const { body } = await client.update({
      index: 'jobs',
      id: jobId,
      body: {
        doc: updatedFields
      }
    });

    console.log(`Updated document with ID ${jobId}`);
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`Document with ID ${jobId} not found`);
    } else {
      console.error(`Error updating document with ID ${jobId}:`, error);
    }
  }
}


module.exports={
  search,
  deleteJobById,
  addToIndex,
  updateJobById
}
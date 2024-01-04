const axios = require('axios');
const cypressSplit = require('cypress-split');
const {determineSplit, determineSplitIndex} = require('./services/split.js');

const cypressSplitLocalDocker = async (on, config) => {
  if (process.env.LOCAL === 'true') {
    const containers = await axios.get('http://localhost/v1.41/containers/json');
    const containerId = process.env.HOSTNAME;
    config.env.split = determineSplit(containers, containerId);
    config.env.splitIndex = determineSplitIndex(containers, containerId);
  }
  cypressSplit(on, config);
};

module.exports = cypressSplitLocalDocker;

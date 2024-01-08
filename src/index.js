const axios = require('axios');
const cypressSplit = require('cypress-split');
const debug = require('debug')('cypress-split');
const { determineSplit, determineSplitIndex } = require('./services/split');

const cypressSplitLocalDocker = async (on, config) => {
  if (process.env.LOCAL === 'true') {
    const containers = (await axios.get(
      'http://localhost/v1.41/containers/json',
      { socketPath: '/var/run/docker.sock' },
    )).data;
    debug('containers:', JSON.stringify(containers, null, 2));
    const containerId = process.env.HOSTNAME;
    debug('containerId:', containerId);
    const split = determineSplit(containers, containerId);
    debug('split:', split);
    // eslint-disable-next-line no-param-reassign
    config.env.split = split;
    const splitIndex = determineSplitIndex(containers, containerId);
    debug('splitIndex:', splitIndex);
    // eslint-disable-next-line no-param-reassign
    config.env.splitIndex = splitIndex;
  }
  cypressSplit(on, config);
};

module.exports = cypressSplitLocalDocker;

const axios = require('axios');
const cypressSplit = require('cypress-split');
const cypressSplitLocalDocker = require('../src/index');

jest.mock('axios');
jest.mock('cypress-split');

describe('index', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('cypressSplitLocalDocker not local', async () => {
    const on = {};
    const config = {};

    await cypressSplitLocalDocker(on, config);

    expect(on).toEqual({});
    expect(config).toEqual({});
    expect(cypressSplit).toHaveBeenCalledTimes(1);
    expect(cypressSplit).toHaveBeenCalledWith(on, config);
  });

  it('cypressSplitLocalDocker local', async () => {
    const on = {};
    const config = {
      env: {},
    };
    process.env.LOCAL = 'true';
    const containerId = 'c737d3401146';
    process.env.HOSTNAME = containerId;
    axios.get.mockResolvedValue({
      data: [
        {
          Id: '1afb51b3616b7641e1a6a8ed755af02b19560a62fd8f38f28625b6ed7cab9a77',
          Labels: {
            'com.docker.compose.service': 'cypress',
          },
          State: 'running',
        },
        {
          Id: 'c737d3401146143189487d9f243124f2d101324d4c7a18decf2447dbf0fd5fef',
          Labels: {
            'com.docker.compose.service': 'cypress',
          },
          State: 'running',
        },
      ],
    });

    await cypressSplitLocalDocker(on, config);

    expect(on).toEqual({});
    const actualConfig = {
      env: {
        split: 2,
        splitIndex: 1,
      },
    };
    expect(config).toEqual(actualConfig);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('http://localhost/v1.41/containers/json', { socketPath: '/var/run/docker.sock' });
    expect(cypressSplit).toHaveBeenCalledTimes(1);
    expect(cypressSplit).toHaveBeenCalledWith(on, actualConfig);
  });
});

const { determineSplit, determineSplitIndex } = require('../../src/services/split');

describe('split', () => {
  it('determine split happy path', () => {
    const containerId = 'c737d3401146';
    const containers = [
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
    ];

    const split = determineSplit(containers, containerId);

    expect(split).toBe(2);
  });

  it('determine split only look at State running', () => {
    const containerId = 'c737d3401146';
    const containers = [
      {
        Id: '1afb51b3616b7641e1a6a8ed755af02b19560a62fd8f38f28625b6ed7cab9a77',
        Labels: {
          'com.docker.compose.service': 'cypress',
        },
        State: 'not-running',
      },
      {
        Id: 'c737d3401146143189487d9f243124f2d101324d4c7a18decf2447dbf0fd5fef',
        Labels: {
          'com.docker.compose.service': 'cypress',
        },
        State: 'running',
      },
    ];

    const split = determineSplit(containers, containerId);

    expect(split).toBe(1);
  });

  it('determine split only look at same service name', () => {
    const containerId = 'c737d3401146';
    const containers = [
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
          'com.docker.compose.service': 'not-cypress',
        },
        State: 'running',
      },
    ];

    const split = determineSplit(containers, containerId);

    expect(split).toBe(1);
  });

  it('determine splitIndex happy path', () => {
    const containerId = 'c737d3401146';
    const containers = [
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
    ];

    const index = determineSplitIndex(containers, containerId);

    expect(index).toBe(1);
  });

  it('determine splitIndex only look at State running', () => {
    const containerId = 'c737d3401146';
    const containers = [
      {
        Id: '1afb51b3616b7641e1a6a8ed755af02b19560a62fd8f38f28625b6ed7cab9a77',
        Labels: {
          'com.docker.compose.service': 'cypress',
        },
        State: 'not-running',
      },
      {
        Id: 'c737d3401146143189487d9f243124f2d101324d4c7a18decf2447dbf0fd5fef',
        Labels: {
          'com.docker.compose.service': 'cypress',
        },
        State: 'running',
      },
    ];

    const index = determineSplitIndex(containers, containerId);

    expect(index).toBe(0);
  });
});

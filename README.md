# cypress-split-local-docker

This package wraps [cypress-split](https://github.com/bahmutov/cypress-split) and uses its [Other CIs](https://github.com/bahmutov/cypress-split?tab=readme-ov-file#other-cis). This package grabs the current container's id and makes an api call to the docker api. It uses these two things to determine the current containers index and the number of containers running with the same service name as the current container. These two numbers are then passed to `cypress-split`.

## Getting Started

Install this package (hopefully later this code will become a part of the `cypress-split` package, otherwise it may be published to npm; but for now, it needs installed from Github):
```
npm install -D git+ssh://git@github.com/TonyBrobston/cypress-split-local-docker.git
```

Update `cypress.config.js`:
```
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      await require('cypress-split-local-docker')(on, config);
      return config;
    },
  },
});
```

Create/Update docker-compose.yml:
```
version: "3.4"

services:
  cypress:
    image: cypress/included
    environment:
      - LOCAL=true
      - SPLIT_FILE=cypress/timings.json
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - .:/home
    working_dir: /home
    entrypoint: /bin/bash -c 'npx wait-on@latest https://central.local.boostretail.com:3001 && npx cypress run'
```

Run the `cypress` service and scale it: 
```
docker-compose up --scale cypress=3
```

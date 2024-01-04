const determineRunningContainers = (containers) => containers.filter(({ State }) => State === 'running');

const determineServiceName = (containers, containerId, serviceKey) => containers.find(
  ({ Id }) => Id.startsWith(containerId),
).Labels[serviceKey];

const determineSplit = (containers, containerId) => {
  const runningContainers = determineRunningContainers(containers);
  const serviceKey = 'com.docker.compose.service';
  const serviceName = determineServiceName(runningContainers, containerId, serviceKey);
  return runningContainers.reduce(
    (accumulator, { Labels }) => (
      Labels[serviceKey] === serviceName ? accumulator + 1 : accumulator
    ),
    0,
  );
};

const determineSplitIndex = (containers, containerId) => determineRunningContainers(containers).map(
  (container) => container.Id.substring(0, containerId.length),
).indexOf(containerId);

module.exports = { determineSplit, determineSplitIndex };

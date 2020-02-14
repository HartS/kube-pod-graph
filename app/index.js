import React from "react";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";
import App from './components/App';
import { kubePodData } from "./data/kube-pod-data-jsonp.js";

const namespaceData = {};

// pod snapshots are taken in 10s increments, or 10000 ms
const timestampIncrement = 10000;
const colors = {
  "runningGreen": "#22FF00",
  "partialRunning": "#006666",
  "brightYellow": "#DDDD00",
  "ContainerCreating": "#888888",
  "CrashLoopBackOff": "#444444",
  "Failed": "#FF0000",
  "Pending": "#FF7700",
  "Unknown": "#FF7700",
  "Succeeded": "#22FF00",
  "Completed": "#22FF00"
}
function createPodTimelineRow(podState) {
  podState.endTimestamp = podState.endTimestamp || (podState.startTimestamp + timestampIncrement);
  let podStateReady = podState.ready.split('/');
  let style;
  if (podState.status === "Running") {
    if (podStateReady[0] === podStateReady[1] && parseInt(podStateReady[0]) > 0) {
      style = colors.runningGreen;
    } else {
      style = colors.partialRunning;
    }
  } else if (colors[podState.status]) {
    style = colors[podState.status];
  } else {
    style = colors.brightYellow;
  }
  return [
    podState.name,
    `${podState.status} ${podState.ready}`,
    style,
    new Date(podState.startTimestamp),
    new Date(podState.endTimestamp)
  ]
}

function addNamespaceData(podState) {
  let namespace = podState.namespace,
      name = podState.name,
      startTimestamp = parseInt(podState.timestamp)*1000,
      endTimestamp = parseInt(podState.timestamp)*1000 + timestampIncrement;
  podState.endTimestamp = endTimestamp;
  podState.startTimestamp = startTimestamp;
  delete podState.timestamp
  namespaceData[namespace] = namespaceData[namespace] || {};
  namespaceData[namespace][name] = namespaceData[namespace][name] || [];
  let previousPodState = namespaceData[namespace][name].slice(-1)[0];
  if (previousPodState && previousPodState[1] === `${podState.status} ${podState.ready}` && parseInt(previousPodState[4]) <= startTimestamp) {
    previousPodState[4] = new Date(endTimestamp);
  } else {
    namespaceData[namespace][name].push(createPodTimelineRow(podState));
  }
}

kubePodData.forEach(addNamespaceData);
let rows = []
Object.keys(namespaceData["kube-system"]).forEach(name => rows.push(...namespaceData["kube-system"][name]));
rows.forEach(row => { row[3] = new Date(row[3]); row[4] = new Date(row[4]);});

const columns = [
  { type: "string", id: "pod-name" },
  { type: 'string', id: 'label' },
  { type: 'string', role: "style"},
  { type: "date", id: "Start" },
  { type: "date", id: "End" }
 
];


class NamespaceSelector extends React.Component {
  render() {
    return <select>test</select>;
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <NamespaceSelector />
        <Chart
          chartType="Timeline"
          data={[columns, ...namespaces["climbingareas"]]}
          width="100%"
          options={{"avoidOverlappingGridLines": false}}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

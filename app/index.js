import React from "react";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";
import { kubePodData } from "../data/kube-pod-data-jsonp.js";

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
      startTimestamp = podState.timestamp*1000,
      endTimestamp = podState.timestamp*1000 + timestampIncrement;
  podState.endTimestamp = endTimestamp;
  podState.startTimestamp = startTimestamp;
  delete podState.timestamp
  namespaceData[namespace] = namespaceData[namespace] || {};
  namespaceData[namespace][name] = namespaceData[namespace][name] || [];
  let previousPodState = namespaceData[namespace][name].slice(-1)[0];
  if (previousPodState) {
    if (previousPodState[1] === `${podState.status} ${podState.ready}`) {
      previousPodState[4] = new Date(endTimestamp);
    } else {
       previousPodState[4] = new Date(startTimestamp)
       namespaceData[namespace][name].push(createPodTimelineRow(podState));
    }
  } else {
    namespaceData[namespace][name].push(createPodTimelineRow(podState));
  }
}

kubePodData.forEach(addNamespaceData);

const columns = [
  { type: "string", id: "pod-name" },
  { type: 'string', id: 'label' },
  { type: 'string', role: "style"},
  { type: "date", id: "Start" },
  { type: "date", id: "End" }
 
];


class NamespaceSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <select value={this.props.getNamespace()} id="namespace" onChange={this.props.handleChange}>
        {Object.keys(namespaceData).map(val => <option value={val}>{val}</option>)}
      </select>
    )
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    let namespaces = Object.keys(namespaceData)
    let namespace;
    if (namespaces.indexOf("scf") >= 0) {
      namespace = "scf";
    } else if (namespace.indexOf("kubecf") >=0) {
      namespace = "kubecf";
    } else {
      namespace = namespaces[0];
    }
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this.getNamespace = this.getNamespace.bind(this);
    this.state = {
      "namespace": namespace
    }
  }

  _handleSelectChange(event) {
    this.setState({"namespace": event.target.value});
    console.log("value", event.target.value);
  }

  getNamespace() {
    return this.state.namespace;
  }

  render() {
    let rows = [];
    Object.keys(namespaceData[this.state.namespace]).forEach(name => rows.push(...namespaceData[this.state.namespace][name]));
    rows.forEach(row => { row[3] = new Date(row[3]); row[4] = new Date(row[4]);});
    return (
      <div className="App">
        <NamespaceSelector
          handleChange={this._handleSelectChange}
          getNamespace={this.getNamespace}
        />
        <Chart
          chartType="Timeline"
          data={[columns, ...rows]}
          options={{"avoidOverlappingGridLines": false}}
          height="100%"
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

# kube-pod-graph

kube-pod-graph monitors pods on a kubernetes deployment for state changes, and generates a visualization of the pod states over time. This is useful for analyzing the deployment of complex workloads to determine bottlenecks, and debug causes of failure.

![example graph](https://github.com/harts/kube-pod-graph/blob/master/example.png?raw=true)

To get started, you will need to clone the `kube-pod-graph` repository and run `npm install` to install dependencies. You will also need the `kubectl` client, and a valid kubeconfig and context.

To start monitoring all pods on a kubernetes installation, `source scripts/kubectl-get-pods-monitoring.sh`, and run `monitor_kubectl_pods`. This function will create the `klog/monitor_kubectl_pods` directory in your $HOME path, and begin saving snapshots of the output of the `kubectl get pods --all-namespaces` command. When your workload deployment is complete, failed, or stalled, you can terminate the `monitor_kubectl_pods` process.

Next, you will need to generate a file containing a [JSONP](https://en.wikipedia.org/wiki/JSONP) script, and place it in your clone of the `kube-pod-graph` repository at `data/kube-pod-data-jsonp.js` (note: the name here is currently hardcoded into index.js):

```
./scripts/generate-jsonp.sh ~/klog/monitor_kubectl_pods/ > data/kube-pod-data-jsonp.js
```

Finally, you'll need to start the server:
```
npm start
```

Once started, you should be able to navigate to `http://localhost:8080` to see a visualization of your kube pods. The select box at the top will allow you to select the namespace you'd like to visualize. Additionally, you can hover over the labels to get the exact time a pod was in a given state (beginning, end, and duration)

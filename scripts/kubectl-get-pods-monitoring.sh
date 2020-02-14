monitor_kubectl_pods()
(
  mkdir -p "$HOME/klog/monitor_kubectl_pods/"
  cd "$HOME/klog/monitor_kubectl_pods/"
  echo "monitoring kubectl pods"
  start_date=$(date +%s)
  while true; do
    kubectl get pods --all-namespaces > new.log
    last_file=$(ls -tr1  | tail -2 | head -1)
    if [[ ${last_file} == new.log ]]; then
      mv new.log $(date +%s)
    else
      if ! diff -q <(awk '{print $1, $2, $3, $4}' new.log) <(awk '{print $1, $2, $3, $4}' ${last_file})  > /dev/null; then
        mv new.log $(date +%s)
      fi
    fi
    sleep 10
  done
)

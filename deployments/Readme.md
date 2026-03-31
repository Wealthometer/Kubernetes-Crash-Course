
## ReplicaSet
Create ReplicaSet
Delete RS

```
kubectl proxy --port=8080

curl -X DELETE 'http://localhost:8080/apis/apps/v1/namespaces/default/replicasets/nginx-rs' \
     -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
     -H "Content-Type: application/json"

```

```
curl -X DELETE 'http://localhost:8080/apis/apps/v1/namespaces/default/replicasets/nginx-rs' \
     -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \

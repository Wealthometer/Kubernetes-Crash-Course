
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
     -H "Content-Type: application/json"

```

```
curl -X DELETE 'http://localhost:8080/apis/apps/v1/namespaces/default/replicasets/nginx-rs' \
     -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
     -H "Content-Type: application/json"

```
## Deployments 
Create deployment
```
kubectl create deploy course --image nginx --replicas 3 --port 80
kubectl rollout status deployment course
```
Update image 
```
kubectl set image deploy course nginx=nginx:1.14.a --record
kubectl annotate deployment/course kubernetes.io/change-cause="Update to nginx:1.14"

```
See the rollout history 
```
kubectl rollout history deploy/course
kubectl rollout history deploy/course --revision=2
```
Rollback deployment when something foes wrong, you can also pause a rollout
```
kubectl rollout undo deployment/course --to-revision=1
```
Scale deployment, you can also do `kubectl edit deployment`

```
kubectl scale deployment/course --replicas=6
kubectl rollout pause deployment/course
```

For Recreate strategy
```


## Secrets with encryption
- Save the enc.yaml file at `/etc/kubernetes/enc/enc.yaml`
- Edit `/etc/kubernetes/manifests/kube-apiserver.yaml` to ad:

```
- --encryption-provider-config=/etc/kubernetes/enc/enc.yaml

```
```
volumeMounts:
- name: enc
  mountPath: /etc/kubernetes/enc
  readOnly: true

volumes:
- name: enc
  hostPath:
    path: /etc/kubernetes/enc
    type: DirectoryOrCreate

```

- Test the secret 

```
kubectl create secret generic demo-secret --from-literal=password=KubeRocks

```
- Use etcdtl to check 
```
export ETCDCTL_API=3
export ETCDCTL_CACERT=/etc/kubernetes/pki/etcd/ca.crt
export ETCDCTL_CERT=/etc/kubernetes/pki/etcd/server.crt
export ETCDCTL_KEY=/etc/kubernetes/pki/etcd/server.key

```

```
etcdctl get /registry/secrets/default/demo-secret | hexdump -C

```
It should start with `k8s:enc:aescbc:v1:key1:`

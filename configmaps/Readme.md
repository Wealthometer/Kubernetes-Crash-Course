
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


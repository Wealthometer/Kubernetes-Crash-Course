from kubernetes import client, config

def main():
    config.load_incluster_config()

    v1 = client.CoreV1Api()
    config_map_name = 'app-config'
    namespace = 'default'


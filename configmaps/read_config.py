from kubernetes import client, config

def main():
    config.load_incluster_config()


from locust import HttpUser, task, between
from urllib.parse import urlencode

class KeycloakLoginUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def login(self):
        payload = {
            "client_id": "frontend-client",
            "username": "testuser",
            "password": "password",
            "grant_type": "password"
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        self.client.post("/realms/demo-realm/protocol/openid-connect/token",
                         data=urlencode(payload), headers=headers)
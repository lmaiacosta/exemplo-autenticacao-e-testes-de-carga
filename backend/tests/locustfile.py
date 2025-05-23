from locust import HttpUser, task, between

class BackendUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def access_protected_api(self):
        headers = {
            "Authorization": "Bearer <INSERT_VALID_ACCESS_TOKEN>"
        }
        self.client.get("/", headers=headers)
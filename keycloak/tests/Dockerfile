FROM python:3.11
WORKDIR /tests
COPY . .
RUN pip install locust
CMD ["locust", "-f", "locustfile.py", "--host", "http://keycloak:8080", "--headless", "-u", "1000", "-r", "10", "--run-time", "1m"]
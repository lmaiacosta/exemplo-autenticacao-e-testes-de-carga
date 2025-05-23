FROM python:3.11
WORKDIR /tests
COPY . .
RUN pip install locust
CMD ["locust", "-f", "locustfile.py", "--host", "http://target"]
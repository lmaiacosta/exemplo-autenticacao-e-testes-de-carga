db = db.getSiblingDB('mydatabase');
db.users.insertOne({
  username: "testuser",
  fullName: "Test User",
  avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  createdAt: new Date(),
  lastLogin: new Date()
});
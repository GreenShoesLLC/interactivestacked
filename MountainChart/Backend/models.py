from app import db

class Todo(db.Model):
    __tablename__ = "Project"

    d = db.Column(db.Integer, primary_key=True, autoincrement=True)
    index = db.Column(db.Integer, nullable=False);
    name = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<Todo {self.id}, {self.name}, {self.capacity}>"
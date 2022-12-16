from flask_sqlalchemy import SQLAlchemy

# session_options={"expire_on_commit": False} =>
# would allow to manipulate out of date models
# after a transaction has been committed
# ! be aware that the above can have unintended side effects
db = SQLAlchemy()


class Todo(db.Model):
    __tablename__ = "Project"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    index = db.Column(db.Integer, nullable=False);
    name = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<Todo {self.id}, {self.name}, {self.capacity}>"
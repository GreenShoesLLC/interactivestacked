import graphene
from .utils import input_to_dictionary
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import db, Project as ProjectModel
from graphene import relay, InputObjectType, Mutation

class ProjectAttribute:
  WorkspaceId = graphene.Int()
  Name = graphene.String()
  BaselineStartDate = graphene.Date()
  BaselinePriority = graphene.Int()
  Tags = graphene.String()

class Project(SQLAlchemyObjectType):

  class Meta:
    model = ProjectModel
    interfaces = (relay.Node,)
  
class CreateProjectInput(InputObjectType, ProjectAttribute):
  pass

class CreateProject(Mutation):
  project = graphene.Field(lambda: Project)

  class Arguments:
    input = CreateProjectInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    new_project = ProjectModel(**data)
    new_project.save()

    return CreateProject(project=new_project)

class UpdateProjectInput(InputObjectType, ProjectAttribute):
  Id = graphene.Int()

class UpdateProject(Mutation):
  project = graphene.Field(lambda: Project)

  class Arguments:
    input = UpdateProjectInput(required=True)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    project = db.session.query(ProjectModel).filter_by(Id=data['Id']).first()
    project.update(data)
    db.session.commit()

    return UpdateProject(ok=True, project=project)

class DeleteProjectInput(InputObjectType, ProjectAttribute):
  Id = graphene.Int()

class DeleteProject(Mutation):
  project = graphene.Field(lambda: Project)

  class Arguments:
    input = DeleteProjectInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    project = db.session.query(ProjectModel).filter_by(Id=data['Id']).first()
    db.session.delete(project)
    db.session.commit()

    return DeleteProject(ok=True)


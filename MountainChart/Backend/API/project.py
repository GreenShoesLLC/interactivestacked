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
  Color = graphene.String()
  StrokeColor = graphene.String()
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
  ok = graphene.Boolean()

  class Arguments:
    input = UpdateProjectInput(required=False)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    uproject = db.session.query(ProjectModel).filter_by(Id=data['Id']).first()
    
    if 'Name' in data:
      uproject.Name = data['Name']
    if 'WorkspaceId' in data:
      uproject.WorkspaceId = data['WorkspaceId']
    if 'BaselineStartDate' in data:
      uproject.BaselineStartDate = data['BaselineStartDate']
    if 'BaselinePriority' in data:
      uproject.BaselinePriority = data['BaselinePriority']
    if 'Tags' in data:
      uproject.Tags = data['Tags']

    db.session.commit()

    return UpdateProject(ok=True, project=uproject)

class UpdateMultiProjectInput(InputObjectType):
  ProjectList = graphene.List(UpdateProjectInput)

class UpdateMultiProject(Mutation):
  ok = graphene.Boolean()

  class Arguments:
    input = UpdateMultiProjectInput(required=False)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    for item in data['ProjectList']:
      uproject = db.session.query(ProjectModel).filter_by(Id=item['Id']).first()
      
      uproject.BaselineStartDate = item['BaselineStartDate']
      uproject.BaselinePriority = item['BaselinePriority']

      db.session.commit()

    return UpdateProject(ok=True) 

class DeleteProjectInput(InputObjectType, ProjectAttribute):
  Id = graphene.Int()

class DeleteProject(Mutation):
  project = graphene.Field(lambda: Project)
  ok = graphene.Boolean()

  class Arguments:
    input = DeleteProjectInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    project = db.session.query(ProjectModel).filter_by(Id=data['Id']).first()

    if project:
      project.remove()
      return DeleteProject(ok=True)
      
    return DeleteProject(ok=False)


import graphene
from .utils import input_to_dictionary
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import db, Project as ProjectModel, PortfolioProject as PortProjectModel
from graphene import relay, InputObjectType, Mutation

class PortProjectAttribute:
  PortfolioId = graphene.Int()
  ProjectId = graphene.Int()
  AdjustedStartDate = graphene.Date()
  AdjustedPriority = graphene.Int()

class PortProject(SQLAlchemyObjectType):

  class Meta:
    model = PortProjectModel
    interfaces = (relay.Node,)
  
class CreatePortProjectInput(InputObjectType, PortProjectAttribute):
  pass

class CreatePortProject(Mutation):
  portProject = graphene.Field(lambda: PortProject)

  class Arguments:
    input = CreatePortProjectInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    project = db.session.query(ProjectModel).filter_by(Id=data['ProjectId']).first()
    data['AdjustedStartDate'] = project.BaselineStartDate
    data['AdjustedPriority'] = project.BaselinePriority
    
    new_portProject = PortProjectModel(**data)
    new_portProject.save()

    return CreatePortProject(PortProject=new_portProject)

class UpdatePortProjectInput(InputObjectType, PortProjectAttribute):
  Id = graphene.Int()

class UpdatePortProject(Mutation):
  portProject = graphene.Field(lambda: PortProject)
  ok = graphene.Boolean()

  class Arguments:
    input = UpdatePortProjectInput(required=True)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    portProject = db.session.query(PortProjectModel).filter_by(Id=data['Id']).first()
    portProject.update(data)
    db.session.commit()

    return UpdatePortProject(ok=True, portProject=portProject)

class DeletePortProjectInput(InputObjectType, PortProjectAttribute):
  Id = graphene.Int()

class DeletePortProject(Mutation):
  portProject = graphene.Field(lambda: PortProject)
  ok = graphene.Boolean()

  class Arguments:
    input = DeletePortProjectInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    portProject = db.session.query(PortProjectModel).filter_by(Id=data['Id']).first()
    db.session.delete(portProject)
    db.session.commit()

    return DeletePortProject(ok=True)


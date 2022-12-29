import graphene
from .utils import input_to_dictionary
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import db, Resource as ResourceModel
from graphene import relay, InputObjectType, Mutation
from graphene.types.json import JSONString

class MResourceAttribute:
  WorkspaceId = graphene.Int()
  Name = graphene.String()
  BaselineCapacity = JSONString()
  Tags = graphene.String()

class MResource(SQLAlchemyObjectType):

  class Meta:
    model = ResourceModel
    interfaces = (relay.Node,)
  
class CreateResourceInput(InputObjectType, MResourceAttribute):
  pass

class CreateResource(Mutation):
  resource = graphene.Field(lambda: MResource)

  class Arguments:
    input = CreateResourceInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    new_resource = ResourceModel(**data)
    new_resource.save()

    return CreateResource(resource=new_resource)

class UpdateResourceInput(InputObjectType, MResourceAttribute):
  Id = graphene.Int()

class UpdateResource(Mutation):
  resource = graphene.Field(lambda: MResource)

  class Arguments:
    input = UpdateResourceInput(required=True)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    resource = db.session.query(ResourceModel).filter_by(Id=data['Id']).first()
    resource.update(data)
    db.session.commit()

    return UpdateResource(ok=True, resource=resource)

class DeleteResourceInput(InputObjectType, MResourceAttribute):
  Id = graphene.Int()

class DeleteResource(Mutation):
  resource = graphene.Field(lambda: MResource)

  class Arguments:
    input = DeleteResourceInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    resource = db.session.query(ResourceModel).filter_by(Id=data['Id']).first()
    db.session.delete(resource)
    db.session.commit()

    return DeleteResource(ok=True)


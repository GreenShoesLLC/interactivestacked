import graphene
from .utils import input_to_dictionary
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import db, Resource as ResourceModel
from graphene import relay, InputObjectType, Mutation

class MResourceAttribute:
  WorkspaceId = graphene.Int()
  Name = graphene.String()
  BaselineCapacity = graphene.String()
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
  ok = graphene.Boolean()


  class Arguments:
    input = UpdateResourceInput(required=False)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    resource = db.session.query(ResourceModel).filter_by(Id=data['Id']).first()
    
    if 'WorkspaceId' in data:
      resource.WorkspaceId = data['WorkspaceId']
    if 'Name' in data:
      resource.Name = data['Name']
    if 'BaselineCapacity' in data:
      resource.BaselineCapacity = data['BaselineCapacity']
    if 'Tags' in data:
      resource.Tags = data['Tags']

    db.session.commit()

    return UpdateResource(ok=True, resource=resource)

class DeleteResourceInput(InputObjectType, MResourceAttribute):
  Id = graphene.Int()

class DeleteResource(Mutation):
  resource = graphene.Field(lambda: MResource)
  ok = graphene.Boolean()

  class Arguments:
    input = DeleteResourceInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    resource = db.session.query(ResourceModel).filter_by(Id=data['Id']).first()

    if resource:
      resource.remove()
      return DeleteResource(ok=True)

    return DeleteResource(ok=False)


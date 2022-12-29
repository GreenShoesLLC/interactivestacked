import graphene
from .utils import input_to_dictionary
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import db, Portfolio as PortfolioModel
from graphene import relay, InputObjectType, Mutation

class PortfolioAttribute:
  WorkspaceId = graphene.Int()
  Name = graphene.String()
  StatusDate = graphene.Date()
  CreatedByUserId = graphene.Int()
  LastModifiedByUserId = graphene.Int()

class Portfolio(SQLAlchemyObjectType):

  class Meta:
    model = PortfolioModel
    interfaces = (relay.Node,)
  
class CreatePortfolioInput(InputObjectType, PortfolioAttribute):
  pass

class CreatePortfolio(Mutation):
  portfolio = graphene.Field(lambda: Portfolio)

  class Arguments:
    input = CreatePortfolioInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    new_portfolio = PortfolioModel(**data)
    new_portfolio.save()

    return CreatePortfolio(Portfolio=new_portfolio)

class UpdatePortfolioInput(InputObjectType, PortfolioAttribute):
  Id = graphene.Int()

class UpdatePortfolio(Mutation):
  portfolio = graphene.Field(lambda: Portfolio)

  class Arguments:
    input = UpdatePortfolioInput(required=True)

  def mutate(self, info, input):
    data = input_to_dictionary(input)

    portfolio = db.session.query(PortfolioModel).filter_by(Id=data['Id']).first()
    Portfolio.update(data)
    db.session.commit()

    return CreatePortfolio(ok=True, portfolio=portfolio)

class DeletePortfolioInput(InputObjectType, PortfolioAttribute):
  Id = graphene.Int()

class DeletePortfolio(Mutation):
  portfolio = graphene.Field(lambda: Portfolio)

  class Arguments:
    input = DeletePortfolioInput(required=True)
  
  def mutate(self, info, input):
    data = input_to_dictionary(input)

    portfolio = db.session.query(PortfolioModel).filter_by(Id=data['Id']).first()
    db.session.delete(portfolio)
    db.session.commit()

    return DeletePortfolio(ok=True)


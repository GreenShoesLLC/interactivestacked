from models.base import BaseModel, db

from datetime import datetime

class Tenant(db.Model, BaseModel):

  __tablename__ = 'Tenant'

class User(db.Model, BaseModel):

  __tablename__ = 'User'

  now = datetime.utcnow
  
  TenantId = db.Column(db.Integer, db.ForeignKey(Tenant.Id), nullable=False)
  Email = db.Column(db.String(30), nullable=False, unique=True)
  Password = db.Column(db.String(100), nullable=False)
  CreatedAt = db.Column(db.DateTime, nullable=False, default=now)
  UpdatedAt = db.Column(db.DateTime, nullable=False, default=now, onupdate=now)
  Deleted = db.Column(db.Boolean, default=0)
  AccountTypeId = db.Column(db.String(30))

class Workspace(db.Model, BaseModel):
  
  __tablename__ = 'Workspace'

  now = datetime.utcnow

  TenantId = db.Column(db.Integer, db.ForeignKey(Tenant.Id), nullable=False)
  StatusDate = db.Column(db.Date, nullable=False, default=now)
  Description = db.Column(db.Text, nullable=True)
  CreatedByUserId = db.Column(db.Integer, db.ForeignKey(User.Id), nullable=False)
  CreatedAt = db.Column(db.DateTime, nullable=False, default=now)
  UpdatedAt = db.Column(db.DateTime, nullable=False, default=now, onupdate=now)
  SharedUsers = db.Column(db.Text, nullable=True)

class Project(db.Model, BaseModel):

  __tablename__ = 'Project'

  WorkspaceId = db.Column(db.Integer, db.ForeignKey(Workspace.Id), nullable=False)
  BaselineStartDate = db.Column(db.DateTime, nullable=False)
  BaselinePriority = db.Column(db.Integer, default=100)
  Tags = db.Column(db.String(20), nullable=True)

class Resource(db.Model, BaseModel):

  __tablename__ = 'Resource'

  WorkspaceId = db.Column(db.Integer, db.ForeignKey(Workspace.Id), nullable=False)
  BaselineCapacity = db.Column(db.Text)
  StartAt = db.Column(db.DateTime, nullable=False)
  Tags = db.Column(db.String(20), nullable=False)

class ProjectResource(db.Model):

  __tablename__ = 'ProjectResource'

  Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  ProjectId = db.Column(db.Integer, db.ForeignKey(Project.Id), nullable=False)
  ResourceId = db.Column(db.Integer, db.ForeignKey(Resource.Id), nullable=False)
  BaselineDemand = db.Column(db.Text, nullable=False)

class Portfolio(db.Model):

  __tablename__ = 'Portfolio'

  now = datetime.utcnow

  Id = db.Column(db.String(40), primary_key=True)
  Name = db.Column(db.String(30), nullable=False)
  WorkspaceId = db.Column(db.Integer, db.ForeignKey(Workspace.Id), nullable=False)
  StatusDate = db.Column(db.DateTime, nullable=False, default=now)
  CreatedByUserId = db.Column(db.Integer, db.ForeignKey(User.Id), nullable=False)
  LastModifiedByUserId = db.Column(db.Integer, db.ForeignKey(User.Id), nullable=False)

class PortfolioProject(db.Model):

  __tablename__ = 'PortfolioProject'

  Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  PortfolioId = db.Column(db.String(40), db.ForeignKey(Portfolio.Id), nullable=False)
  ProjectId = db.Column(db.Integer, db.ForeignKey(Project.Id), nullable=False)
  IsSelected = db.Column(db.Boolean, default=0)
  AdjustedStartDate = db.Column(db.DateTime, nullable=False)
  AdjustedPriority = db.Column(db.Integer, nullable=False)

class PortfolioResource(db.Model):

  __tablename__ = 'PortfolioResource'

  Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  PortfolioId = db.Column(db.String(40), db.ForeignKey(Portfolio.Id), nullable=False)
  ResourceId = db.Column(db.Integer, db.ForeignKey(Resource.Id), nullable=False)
  AdjustedCapacity = db.Column(db.Text)

class PortfolioProjectResource(db.Model):

  __tablename__ = 'PortfolioProjectResource'

  Id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  PortfolioProjectId = db.Column(db.Integer, db.ForeignKey(PortfolioProject.Id), nullable=False)
  PortfolioResourceId = db.Column(db.Integer, db.ForeignKey(PortfolioResource.Id), nullable=False)
  AdjustDemand = db.Column(db.Text, nullable=False)
from models.base import BaseModel, BaseModel2, db

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
  AnchorDate = db.Column(db.Date, nullable=False, default=now)
  TimeInterval = db.Column(db.String(20), nullable=False, default='Monthly')
  Description = db.Column(db.Text, nullable=True)
  CreatedByUserId = db.Column(db.Integer, db.ForeignKey(User.Id), nullable=False)
  CreatedAt = db.Column(db.DateTime, nullable=False, default=now)
  UpdatedAt = db.Column(db.DateTime, nullable=False, default=now, onupdate=now)
  SharedUsers = db.Column(db.Text, nullable=True)

class Project(db.Model, BaseModel):

  __tablename__ = 'Project'

  WorkspaceId = db.Column(db.Integer, db.ForeignKey(Workspace.Id), nullable=False)
  BaselineStartDate = db.Column(db.Date, nullable=False)
  BaselinePriority = db.Column(db.Integer, default=100)
  Color = db.Column(db.String(20), nullable=True)
  StrokeColor = db.Column(db.String(20), nullable=True)
  Tags = db.Column(db.String(20), nullable=True)

  workspace = db.relationship('Workspace', backref='projects')

class Resource(db.Model, BaseModel):

  __tablename__ = 'Resource'

  WorkspaceId = db.Column(db.Integer, db.ForeignKey(Workspace.Id), nullable=False)
  BaselineCapacity = db.Column(db.Text)
  Tags = db.Column(db.String(20), nullable=False)

  workspace = db.relationship('Workspace', backref='resources')

class ProjectResource(db.Model, BaseModel2):

  __tablename__ = 'ProjectResource'

  ProjectId = db.Column(db.Integer, db.ForeignKey(Project.Id), nullable=False)
  ResourceId = db.Column(db.Integer, db.ForeignKey(Resource.Id), nullable=False)
  BaselineDemand = db.Column(db.Text, nullable=False)

  resource = db.relationship('Resource', backref='pro')
  project = db.relationship('Project', backref='res')

class Portfolio(db.Model):

  __tablename__ = 'Portfolio'

  now = datetime.utcnow

  Id = db.Column(db.String(40), primary_key=True)
  Name = db.Column(db.String(30), nullable=False)
  WorkspaceId = db.Column(db.Integer, db.ForeignKey(Workspace.Id), nullable=False)
  StatusDate = db.Column(db.Date, nullable=False, default=now)
  CreatedByUserId = db.Column(db.Integer, db.ForeignKey(User.Id), nullable=False)
  LastModifiedByUserId = db.Column(db.Integer, db.ForeignKey(User.Id), nullable=False)

  workspace = db.relationship('Workspace', backref='portfolios')

  def save(self):
    db.session.add(self)
    db.session.commit()

  def remove(self):
    db.session.delete(self)
    db.session.commit()

class PortfolioProject(db.Model, BaseModel2):

  __tablename__ = 'PortfolioProject'

  PortfolioId = db.Column(db.String(40), db.ForeignKey(Portfolio.Id), nullable=False)
  ProjectId = db.Column(db.Integer, db.ForeignKey(Project.Id), nullable=False)
  IsSelected = db.Column(db.Boolean, default=0)
  AdjustedStartDate = db.Column(db.Date, nullable=False)
  AdjustedPriority = db.Column(db.Integer, nullable=False)

  portfolio = db.relationship('Portfolio', backref='PortProjects')
  project = db.relationship('Project', backref='Projects')

class PortfolioResource(db.Model, BaseModel2):

  __tablename__ = 'PortfolioResource'

  PortfolioId = db.Column(db.String(40), db.ForeignKey(Portfolio.Id), nullable=False)
  ResourceId = db.Column(db.Integer, db.ForeignKey(Resource.Id), nullable=False)
  AdjustedCapacity = db.Column(db.Text)

  portfolio = db.relationship('Portfolio', backref='PortResources')
  resource = db.relationship('Resource', backref='Resources')

class PortfolioProjectResource(db.Model, BaseModel2):

  __tablename__ = 'PortfolioProjectResource'

  PortfolioProjectId = db.Column(db.Integer, db.ForeignKey(PortfolioProject.Id), nullable=False)
  PortfolioResourceId = db.Column(db.Integer, db.ForeignKey(PortfolioResource.Id), nullable=False)
  AdjustedDemand = db.Column(db.Text, nullable=False)

  portProject = db.relationship('PortfolioProject', backref='PortProRes')
  portResource = db.relationship('PortfolioResource', backref='PortProRes')
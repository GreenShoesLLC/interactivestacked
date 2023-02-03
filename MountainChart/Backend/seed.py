from app import app, bcrypt
from models import Tenant, User, Workspace, Project, Resource, ProjectResource, Portfolio, PortfolioResource, PortfolioProject,PortfolioProjectResource
from models import db

import re
import json
import random
from datetime import datetime

def password(password_plaintext):
    if not re.match('^(?=.*\W)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{5,20}$', password_plaintext):
      raise AssertionError('Password must contain 1 capital, 1 number, one symbol and be between 5 and 20 charetars long.')
    return bcrypt.generate_password_hash(password_plaintext).decode('utf-8')

with app.app_context():

  db.drop_all()
  db.create_all()
  # Add a new Tenant
  developer = Tenant( Name='Developer' )
  developer.save()

  # Add a new User to that Tenant
  user = User(
    Name='Dan Hickman',
    Email = 'numeric0900@gmail.com',
    Password = password('QWE@#$asd234'),
    TenantId = 1,
    AccountTypeId = ''
  )
  user.save()

  # Add a new Workspace to the Tenant

  workspacelist = [
    {
      'TenantId': 1,
      'Name':  'workspace1',
      'AnchorDate': '2022-05-01',
      'Description': 'chart1',
      'CreatedByUserId': 1
    },
    {
      'TenantId': 1,
      'Name':  'workspace2',
      'AnchorDate': '2022-03-01',
      'Description': 'chart2',
      'CreatedByUserId': 1
    },
    {
      'TenantId': 1,
      'Name':  'workspace3',
      'AnchorDate': '2022-04-01',
      'Description': 'chart3',
      'CreatedByUserId': 1
    }
  ]
  work = []
  for i in range(3):
    work.append(
      Workspace(
        TenantId = workspacelist[i]['TenantId'],
        Name = workspacelist[i]['Name'],
        AnchorDate = datetime.strptime(workspacelist[i]['AnchorDate'], '%Y-%m-%d').date(),
        Description = workspacelist[i]['Description'],
        CreatedByUserId = workspacelist[i]['CreatedByUserId']
      )
    )
  db.session.add_all(work)
  db.session.commit()

  # Add 3 Resources to that Workspace
  Resources = ['Developers', 'QA', 'Business Analyst', 'Designer']
  dev = []
  BaselineCapacity = []
  for i in range(14):
    x = 1
    if i >= 1 and i <= 3:
      x = 2
    if i >= 4:
      x = 3
    y = []
    for j in range(24):
      y.append(random.randrange(10, 15))
    BaselineCapacity.append(y)
    dev.append(
      Resource(
        WorkspaceId = x,
        Name = Resources[i%4] + str(i),
        BaselineCapacity = json.dumps(BaselineCapacity[i]),
        Tags = ''
      )
    )

  db.session.add_all(dev)
  db.session.commit()
  print('Resources Created!')

  # Add 10 Projects to that Workspace
  BaselineStartDate = ['2023-01-01', '2024-03-01', '2023-05-01', '2023-07-01', '2023-09-01', '2024-11-01', '2024-01-01', '2024-04-01', '2024-06-01', '2024-08-01', '2024-10-01', '2025-01-01', '2025-02-01', '2025-03-01', '2025-04-01']
  Name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  Color = [{  
      "strokecolor": "#990000",
      "color": "#ff3333"
    },
    {
      "strokecolor": "#009900",
      "color": "#33ff33"
    },
    {
      "strokecolor": "#006699",
      "color": "#33bbff"
    },
    {
      "strokecolor": "#999900",
      "color": "#ffff33",
      "prority": "3",
      "start": "2022.7"
    },
    {
      "strokecolor": "#3d5c5c",
      "color": "#85adad",
      "prority": "3",
      "start": "2022.9"
    },
    {
      "strokecolor": "#990099",
      "color": "#cc00cc"
    },
    {
      "strokecolor": "#669900",
      "color": "#bbff33"
    },
    {
      "strokecolor": "#990073",
      "color": "#ff33cc"
    },
    {
      "strokecolor": "#004d99",
      "color": "#3399ff"
    },
    {
      "strokecolor": "#262673",
      "color": "#6666cc"
    }]
  Projects = []
  for i in range(130):
    x = 1
    if i>=10 and i<= 29:
      x = 2
    if i>=30:
      x = 3
    Projects.append(
      Project(
        WorkspaceId = x,
        Name = Name[i%10] + str(i),
        BaselineStartDate = datetime.strptime(BaselineStartDate[i%15], '%Y-%m-%d').date(),
        BaselinePriority = i,
        Color = Color[i%10]['color'],
        StrokeColor = Color[i%10]['strokecolor']
      )
    )

  db.session.add_all(Projects)
  print('Projects Created!')

  ProjectResources = []
  BaselineDemand = []
  for i in range(130):
    s = 1
    t = 2
    if i >= 10 and i <= 29:
      s = 2
      t = 5
    if i >= 30:
      s = 5
      t = 15
    for j in range(s, t):
      x = []
      for y in range(random.randrange(2, 15)):
        x.append(random.randrange(1, 6))
      BaselineDemand.append(x)
      ProjectResources.append(
        ProjectResource(
          ProjectId = (i + 1),
          ResourceId = j,
          BaselineDemand = json.dumps(BaselineDemand[i+(j-s)])
        )
      )      

  db.session.add_all(ProjectResources)
  db.session.commit()
  print('ProjectResources Created!')

  # Create a Portfolio in that Workspace
  Portlist = [
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d1',
      'workspaceId': 1,
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d2',
      'workspaceId': 1
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d3',
      'workspaceId': 1
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d4',
      'workspaceId': 2
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d5',
      'workspaceId': 2
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d6',
      'workspaceId': 2
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d7',
      'workspaceId': 3
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d8',
      'workspaceId': 3
    },
    {
      'Id': '2ca64e7b-7d3e-4337-86cf-f3a4e0b783d9',
      'workspaceId': 3
    },
  ]

  Port = []
  for i in range(9):
    Port.append(Portfolio(
      Id = Portlist[i]['Id'],
      WorkspaceId = Portlist[i]['workspaceId'],
      Name = 'Portfolio' + str(i+1),
      StatusDate = datetime.strptime('2023-01-01', '%Y-%m-%d').date(),
      CreatedByUserId = 1,
      LastModifiedByUserId = 1
    ))

  db.session.add_all(Port)
  db.session.commit()
  print('Portfolio Created!')

  # For the 3 resources, create a PortfolioResource row

  PortfolioResources = []
  for i in range(9):
    s = 1
    t = 2
    if i >= 3:
      s = 2
      t = 5
    if i >= 6:
      s = 5
      t = 15
    for j in range(s, t):
      PortfolioResources.append(
        PortfolioResource(
          PortfolioId = Portlist[i]['Id'],
          ResourceId = j,
          AdjustedCapacity = json.dumps(BaselineCapacity[j-1])
        )
      )
  
  db.session.add_all(PortfolioResources)
  db.session.commit()
  print('PortfolioResources Created!')

  # For the 10 projects, create a PortfolioProject row in the db.

  PortfolioProjects = []

  for i in range(9):
    s = 1
    t = 11
    if i >= 3:
      s = 11
      t = 31
    if i >= 6:
      s = 31
      t = 131

    select = 0
    num = 0
    if i % 3 == 1:
      num = random.randrange(s, t)
    if i % 3 == 2:
      select = 1
    for j in range(s, t):
      if num != 0 :
        select = 0
        if j == num:
          select = 1
      PortfolioProjects.append(
        PortfolioProject(
          PortfolioId = Portlist[i]['Id'],
          ProjectId = j,
          AdjustedStartDate = datetime.strptime(BaselineStartDate[(j-1)%15], '%Y-%m-%d').date(),
          AdjustedPriority = j-1,
          IsSelected = select,
        )
      )

  db.session.add_all(PortfolioProjects)
  db.session.commit()
  print('PortfolioProjects Created!')

  # Create a PortfolioProjectResource

  box = [
    {
      'portPro': [1, 11],
      'portRes': [1, 2]
    },
    {
      'portPro': [11, 21],
      'portRes': [2, 3]
    },
    {
      'portPro': [21, 31],
      'portRes': [3, 4]
    },
    {
      'portPro': [31, 51],
      'portRes': [4, 7]
    },
    {
      'portPro': [51, 71],
      'portRes': [7, 10]
    },
    {
      'portPro': [71, 91],
      'portRes': [10, 13]
    },
    {
      'portPro': [91, 191],
      'portRes': [13, 23]
    },
    {
      'portPro': [191, 291],
      'portRes': [23, 33]
    },
    {
      'portPro': [291, 391],
      'portRes': [33, 43]
    }
  ]

  PortfolioProjectResources = []
  for item in enumerate(box):
    index, data = item

    demandIndex = 0
    if index >= 3:
      demandIndex = 10
    if index >= 6:
      demandIndex = 70
    for i in range(data['portPro'][0], data['portPro'][1]):
      for j in range(data['portRes'][0], data['portRes'][1]):
        PortfolioProjectResources.append(
          PortfolioProjectResource(
            PortfolioProjectId = i,
            PortfolioResourceId = j,
            AdjustedDemand = json.dumps(BaselineDemand[demandIndex])
          )
        )

  db.session.add_all(PortfolioProjectResources)
  print('PortfolioProjectResources Created!')

  db.session.commit()

  print('Adding to database...')

  print('Everything works!')
  

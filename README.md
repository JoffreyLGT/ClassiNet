# Product Classification API

## About this project

The goal is this project is to build the same API as done in the project [JoffreyLGT/e-commerce-mlops](https://github.com/JoffreyLGT/e-commerce-mlops?tab=readme-ov-file#backend-q&a) but using .NET instead of Python.

It is purely an experiment to see if the performance would be better.

The API is fully documentation using OpenAPI / Swagger.

### Tech Stack

- Language: C#
- Framework: .NET 8.0
- ORM: Entity Framework Core
- Database: PostgreSQL
- Other:
  - Docker for containers management

### Library used

| Name                                                                                                          | Reason                                            |
|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| [Microsoft.EntityFrameworkCore](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore)                 | ORM to interract with the database.               |
| [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL) | EFCore Driver to connect to PostgreSQL databases. | 
| [Swashbuckle.AspNetCore](https://www.nuget.org/packages/Swashbuckle.AspNetCore) | Swagger tools for documenting APIs built on ASP.NET Core |
| [Swashbuckle.AspNetCore.Annotations](https://www.nuget.org/packages/Swashbuckle.AspNetCore.Annotations) | Provides custom attributes that can be applied to controllers, actions and models to enrich the generated Swagger |

## Requirements

- Docker
- [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

## Start database

- Open the project directory in your terminal and type the commands:
```bash
docker compose -f docker-compose.xaml up -d
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Database


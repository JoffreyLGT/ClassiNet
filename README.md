# Product Categorization

## About this project

The goal is this project is to build a service to categorize products for an e-commerce platform.<br />
The service can be consumed through an API and managed with a Dashboard.

> 🚀 Powered by the most up-to-date versions of .NET and Angular!

### Features

-  REST API fully documented with OpenAPI standards.
  - SwaggerUI is activated to test the API in the browser.
- Dashboard to manage the service:
  - Data visualization with charts and KPI.
  - Data management: Users and Products
- (Soon) Deep learning model for automatic categorization.

> [!TIP]
> Head to the [Issues](https://github.com/JoffreyLGT/Product-categorization/issues) to see what is currently developed.

### Tech Stack

#### API

- Language: C#
- Framework: .NET 9.0
- ORM: Entity Framework Core

#### Dashboard

- Language: TypeScript
- Framework: Angular 19

#### Other

- Database: PostgreSQL
- Containers management: Docker

## Developer notes

> [!NOTE]
> This section is purely a notepad for developers.

### Database setup

- Open the project directory in your terminal and type the commands:
```bash
docker compose -f docker-compose.xaml up -d
cd API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Note: There are currently no migration saved in the project since it has yet to reach a release version.

### Database modeling

> [!CAUTION]
> This is outdated, an update will be provided before the release.

```mermaid
erDiagram
    Products {
        int Id
        string Designation
        string Description
        string ImageId
    }

    Users {
        int Id
        string Email
        boolean IsActive
        string Name
        string Company
        string Password
    }
```

### Resources

#### Dashboard

- [Angular documentation](https://angular.dev/)
- [TailwindCSS documentation](https://tailwindcss.com/)
- [DaisyUI documentation](https://daisyui.com/)
- [echarts API documentation](https://echarts.apache.org/en/option.html#title)
- [Remix icons](https://remixicon.com/)
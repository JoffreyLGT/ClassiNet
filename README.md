# ClassiNet: e-commerce product categorization

![Screenshot 2025-01-15 at 16 55 37](https://github.com/user-attachments/assets/cd289c75-e6df-410c-96de-5b5eb9dca24f)

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

| Component | Language | Framework | Others |
| --- | --- | --- | --- |
| API | C# | .NET 9.0 | Entity Framework Core |
| Dashboard | TypeScript | Angular 19 | TailwindCSS, DaisyUI, eCharts, RemixIcon |
| Database | | | PostgreSQL |
| Container management | | | Docker |

### Screenshots

#### Dashboard view: Data Visualization (light mode)
![Screenshot 2025-01-15 at 16 54 01](https://github.com/user-attachments/assets/2225d319-2bca-4a7a-b26b-d60210c7367b)

#### Dashboard view: User management (light mode)
![Screenshot 2025-01-15 at 17 07 03](https://github.com/user-attachments/assets/d5c92f87-2f96-40ec-9aee-749e2dbe59b8)

#### Dashboard view: add new user (light mode)
![Screenshot 2025-01-15 at 17 07 26](https://github.com/user-attachments/assets/f819a605-0268-4148-a80c-fbe6a2664888)

#### Dashboard view: product management (dark mode)
![Screenshot 2025-01-15 at 17 12 00](https://github.com/user-attachments/assets/d7e23aa6-d0e2-4681-8249-18a99dd00d1e)

#### API: Swagger documentation
![Screenshot 2025-01-15 at 17 09 55](https://github.com/user-attachments/assets/1b155b71-0d5c-4f94-baf8-9649eac86493)


## Developer notes

> [!NOTE]
> This section is purely a notepad for developers.


### Configuration

Configuration is done using the provided `.env` file.
- When building this service, the environment variable will be injected into the backend container and will be available to the API.
- The frontend has a compilation script called `set-env.ts` to convert the needed variables from the `.env` file into Angular's `environment.ts` files. This is a necessary step since the frontend is executed on the client's machine, environment variables are not available.

### Local database setup

- Open the project directory in your terminal and type the commands:
```bash
docker compose -f docker-compose.yaml up -d
cd API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Note: There are currently no migration saved in the project since it has yet to reach a release version.

### Generate environment files for the frontend

Since the project is configured using a `.env` file, we must generate the environment.ts file for Angular.
A script called `set-env.ts` allows that.

#### Serve the application

```shell
npm run prestart && ng serve
```

#### Build the application

```shell
npm run prebuild && ng build
```

### Resources

#### Dashboard

- [Angular documentation](https://angular.dev/)
- [TailwindCSS documentation](https://tailwindcss.com/)
- [DaisyUI documentation](https://daisyui.com/)
- [echarts API documentation](https://echarts.apache.org/en/option.html#title)
- [Remix icons](https://remixicon.com/)

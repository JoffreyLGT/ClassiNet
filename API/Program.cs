using System.Reflection;
using System.Text;
using API.Models;
using API.Utilities;
using Database;
using Database.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders().AddConsole();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:4200",
                    "https://localhost:*")
                .WithExposedHeaders(PaginatorHeader.HeaderName)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "Product Categorization API",
            Description = "Use deep learning model to categorize your products.",
            Version = "v1"
        }
    );

    c.IncludeXmlComments(Assembly.GetExecutingAssembly());

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddIdentity<UserEntity, RoleEntity>(opt =>
    {
        opt.Password.RequiredLength = 7;
        opt.Password.RequireDigit = false;
        opt.Password.RequireUppercase = false;
        opt.User.RequireUniqueEmail = true;
        // Add the possibility to have spaces in user names
        opt.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ ";
    })
    .AddEntityFrameworkStores<AppDbContext>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.GetValue<string>("Key")!))
    };
});

builder.Services.AddAuthorization(opt => { opt.AddPolicy("OnlyAdminUsers", policy => policy.RequireRole("Admin")); });

// Insert the prediction model in the dependency injection
builder.Services.AddSingleton<MLModelManager>();

// Insert the JSON Web Token handler in the dependency injection
builder.Services.AddSingleton<JwtHandler>();


// Add the frontend files to the static files
builder.Services.AddSpaStaticFiles(configuration =>
{
    var frontendPath = builder.Configuration.GetValue<string>("FrontendPath");
    if (string.IsNullOrEmpty(frontendPath))
        Console.WriteLine("frontendPath is not set.");
    else if (!Directory.Exists(frontendPath))
        Console.WriteLine($"frontendPath doesn't exist: {frontendPath}");
    else
        configuration.RootPath = frontendPath;
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

// Serve the frontend files
app.UseSpaStaticFiles();
app.UseSpa(spa => { });

app.Run();

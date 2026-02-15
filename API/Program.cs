using API.Consumers;
using API.Data;
using API.Hubs;
using API.Interface;
using API.Services;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContextPool<AppDBContext>(options =>
{
    var connStr = builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseSqlServer(connStr, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    });
});

//builder.Services.AddHealthChecks()
//    .AddDbContextCheck<AppDBContext>();

builder.Services.AddStackExchangeRedisCache(redisOptions =>
{
	var connStr = builder.Configuration.GetConnectionString("Redis");
	redisOptions.Configuration = connStr;
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//JWT configuration 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>    //configure JWT rules
	{
		var tokenkey = builder.Configuration["TokenKey"]
			?? throw new Exception("cannot get token key - Program.cs");
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenkey)),
			ValidateIssuer = false,
			ValidateAudience = false
		};
	});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.WebHost.ConfigureKestrel(serverOptions =>
{
	serverOptions.ListenAnyIP(5000);
});

builder.Services.AddSignalR();

builder.Services.AddMassTransit(x =>
{
	// Register Consumers
	x.AddConsumer<UserCreatedConsumer>();

	x.UsingRabbitMq((context, cfg) =>
	{
		cfg.Host("localhost", "/", h =>
		{
			h.Username("guest");
			h.Password("guest");
		});

		// Auto configure endpoints based on consumer names
		cfg.ConfigureEndpoints(context);
	});
});

var app = builder.Build();
	
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.MapHub<ChatHub>("/chatHub"); 
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

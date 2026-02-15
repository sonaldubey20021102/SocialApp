using API.Data;
using API.DTOs;
using API.Entities;
using API.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{

	public class AuthController(AppDBContext context ,ITokenService tokenService) : BaseApiController
	{
		[HttpPost("regsiter")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{


			if (await context.Users.AnyAsync(x => x.Email == registerDto.Email)) return BadRequest("Email already exists");
			var hmac = new HMACSHA512();
			var user = new User
			{
				Email=registerDto.Email,
				UserName=registerDto.UserName,
				PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
				PasswordSalt = hmac.Key
			};
			await context.Users.AddAsync(user);
			await context.SaveChangesAsync();
			return new UserDto
			{
				Email = user.Email,
				UserName = user.UserName,
				Id = user.Id,
				Token = tokenService.CreateToken(user)
			};
		}

		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = new User
			{
				UserName = "testuser",
				Email = loginDto.email
			};
			return new UserDto
			{
				Id = user.Id,
				UserName = "testuser",
				Email = loginDto.email,
				Token = tokenService.CreateToken(user)
			};
		}


		
	}
}

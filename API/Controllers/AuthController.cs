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

	public class AuthController(AppDBContext appDBContext,ITokenService tokenService) : BaseApiController
	{
		[HttpPost("register")]
		public async Task<ActionResult<User>> Register(RegisterDto registerDto)
		{
			if (await appDBContext.users.AnyAsync(x => x.Email == registerDto.Email)) return BadRequest("Already exists");
			var hmac = new HMACSHA512();

			var user =  new User
			{
				Email = registerDto.Email,
				UserName = registerDto.UserName,
				PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
				PasswordSalt = hmac.Key
			};

			appDBContext.users.Add(user);
			await appDBContext.SaveChangesAsync();
			return user;
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
using API.DTOs;
using API.Entities;
using API.Interface;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

	public class AuthController(ITokenService tokenService) : BaseApiController
	{
		[HttpPost("register")]
		public async Task<ActionResult<RegisterDto>> Register(RegisterDto registerDto)
		{
			return new RegisterDto
			{
				Email = registerDto.Email,
				UserName = registerDto.UserName,
				Password = registerDto.Password
			};
		}

		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = new AppUser
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
using API.Entities;
using API.Interface;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
namespace API.Services
{
	public class TokenService(IConfiguration config):ITokenService
	{
		public string CreateToken(AppUser user)
		{
			var tokenkey = config["TokenKey"] ?? throw new Exception("cannot get token key");
			if (tokenkey.Length < 64)
				throw new Exception("Token Key is too short it will be 64 characters long");

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenkey));

			var cliam = new List<Claim>
		{
			new(ClaimTypes.Email,user.Email),
			new(ClaimTypes.NameIdentifier,user.Id)
		};
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
			var tokendescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(cliam),
				Expires = DateTime.Now.AddDays(7),
				SigningCredentials = creds,
			};
			var tokkenhandler = new JwtSecurityTokenHandler();
			var token = tokkenhandler.CreateToken(tokendescriptor);
			return tokkenhandler.WriteToken(token);

		}
	}
}

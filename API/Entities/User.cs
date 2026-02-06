using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
	public class User
	{
		public string Id { get; set; } = Guid.NewGuid().ToString();

		[Required]
		[MaxLength(100)]
		public required string UserName { get; set; }
		public required string Email { get; set; }

		[Required]
		public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
		[Required]
		public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
	}
}

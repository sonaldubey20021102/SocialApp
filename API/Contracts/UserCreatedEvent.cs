	namespace API.Contracts
{
	public record UserCreatedEvent
	{
		public Guid UserId { get; init; }
		public string Email { get; init; } = default!;
	}
}

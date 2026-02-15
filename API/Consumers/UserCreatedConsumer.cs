using API.Contracts;
using MassTransit;

namespace API.Consumers
{
	public class UserCreatedConsumer : IConsumer<UserCreatedEvent>
	{
		public async Task Consume(ConsumeContext<UserCreatedEvent> context)
		{
			var message = context.Message;

			Console.WriteLine($"User created: {message.Email}");

			await Task.CompletedTask;
		}
	}
}

using API.Entities;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
	public class ChatHub: Hub
	{
		public async Task SendMessage(User user, string message)
		{

		}
	}
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;

namespace API.Controllers
{
    public class IdentityController(IDistributedCache dc) : Controller
    {

        private readonly IDistributedCache dc = dc;

        public IActionResult Index()
        {
            return View();
        } 

        public async Task<IActionResult> CheckUsername(string s_username, CancellationToken cancellation)
        {
            string? username = await dc.GetStringAsync(s_username);
            if (string.IsNullOrEmpty(username)) { 
                // fetch from db

            }

            return Json(new { });
        }
    }
}

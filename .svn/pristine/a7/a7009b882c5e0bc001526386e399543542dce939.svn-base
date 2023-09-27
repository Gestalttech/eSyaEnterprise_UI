using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.DataServices
{
    public interface IRazorpayClientServices
    {
        Task<DO_Order_response> FetchOrder(string orderKey);
    }

    public class RazorpayClientServices : IRazorpayClientServices
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        public RazorpayClientServices(IeSyaGatewayServices eSyaGatewayServices)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
        }

        public async Task<DO_Order_response> FetchOrder(string orderKey)
        {
            try
            {
                var parameter = "?orderKey=" + orderKey;
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_Order_response>("RazorpayClient/FetchOrder"+ parameter);
                return serviceResponse.Data;
            }

            catch (Exception ex)
            {
                return new DO_Order_response();
            }
        }
    }

    public class DO_Order_response
    {
        public string id { get; set; }
        public string entity { get; set; }
        public decimal amount { get; set; }
        public decimal amount_paid { get; set; }
        public decimal amount_due { get; set; }
        public string currency { get; set; }
        public string receipt { get; set; }
        public string offer_id { get; set; }
        public string status { get; set; }
        public string attempts { get; set; }
        public string created_at { get; set; }
    }
}

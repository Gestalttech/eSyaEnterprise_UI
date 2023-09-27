using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Services
{

    public interface ISmsSender
    {
        Task SendSmsAsync(string mobileNumber, string message);
    }
    public class SmsSender : ISmsSender
    {
        HttpClient client = new HttpClient();
        //string _smsBaseURL = "https://smsmisr.com/api/webapi/";
        //string _smsBalanceVerifyURL_ = "https://smsmisr.com/api/Request/";
        //string _smsVerify = "https://smsmisr.com/api/verify/";
        string username = "0kTd3qxmil";
        string password = "7EaBtr1VyD";
        string sender = "assih";
        public Task SendSmsAsync(string mobileNumber, string messageText)
        {
            client = new HttpClient();
            var uri = new Uri("https://smsmisr.com/api/webapi/?username=" + username + "&password=" + password + "&language=1&sender=" + sender + "&mobile=" + mobileNumber + ",&message=" + messageText);

            SMSParameter param = new SMSParameter();
            var json = JsonConvert.SerializeObject(param);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var Items = new SMSReponse();
            try
            {
                HttpResponseMessage response = client.PostAsync(uri, content).Result;
                if (response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsStringAsync().Result;
                    Items = JsonConvert.DeserializeObject<SMSReponse>(result);
                    if (Items.code == "1901")
                        Items.ResponseMessage = true;
                    else
                        Items.ResponseMessage = false;
                }
                else
                    Items.ResponseMessage = false;
            }
            catch
            {
            }
            return Task.FromResult(0);
        }
    }

    public class SMSParameter
    {
        public string username { get; set; }
        public string password { get; set; }
        public string request { get; set; }
        public string SMSID { get; set; }
        public string language { get; set; }
        public string sender { get; set; }
        public string mobile { get; set; }
        public string message { get; set; }
        public string DelayUntil { get; set; }
    }

    public class SMSReponse
    {
        public string code { get; set; }
        public string SMSID { get; set; }
        public bool ResponseMessage { get; set; }

    }
}

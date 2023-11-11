using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Options;
using System.Configuration;
using System.Globalization;
using DocumentFormat.OpenXml.InkML;
using NuGet.Configuration;
using eSyaEssentials_UI;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using eSyaEnterprise_UI.ActionFilter;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;
using eSyaEnterprise_UI.ResourcesExtention;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using System.Net.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using eSyaEnterprise_UI.Areas.ConfigureSMS.Data;
using eSyaEnterprise_UI.Areas.Localize.Data;
using eSyaEnterprise_UI.Areas.ConfigProduct.Data;
using eSyaEnterprise_UI.Areas.ConfigFacilities.Data;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.Admin.Data;
using eSyaEnterprise_UI.Areas.ManageServices.Data;
using eSyaEnterprise_UI.Areas.Stores.Data;
using eSyaEnterprise_UI.Areas.ConfigInventory.Data;
using eSyaEnterprise_UI.Areas.ManageRates.Data;
using eSyaEnterprise_UI.Areas.Vendor.Data;
//using eSyaEnterprise_UI.Localization;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddRazorPages().AddRazorRuntimeCompilation();
// Add services to the container.
builder.Services.AddControllersWithViews()
                .AddDataAnnotationsLocalization();

//builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.AddMvc()
    .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
    .AddDataAnnotationsLocalization();


var sessionTimeout = Convert.ToInt32(builder.Configuration.GetSection("SessionTimeInMintues").GetSection("TimeOut").Value ?? "30");


//var sessionTimeout = Convert.ToInt32(Configuration.GetSection("SessionTimeInMintues").GetSection("TimeOut").Value ?? "30");

// Sesssion
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Path = "/";
    options.IdleTimeout = TimeSpan.FromMinutes(sessionTimeout);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.CheckConsentNeeded = context => true;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

builder.Services.Configure<DO_AppConfig>(builder.Configuration.GetSection("cnf"));

builder.Services.Configure<DO_PasswordPolicy>(builder.Configuration.GetSection("PasswordPolicy"));

builder.Services.AddHttpClient<IHttpClientServices, HttpClientServices>();

builder.Services.AddHttpClient<IeSyaGatewayServices, eSyaGatewayServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaGateway_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));
});

builder.Services.AddHttpClient<IeSyaProductSetupAPIServices, eSyaProductSetupAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaProductSetup_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});

builder.Services.AddHttpClient<IeSyaSMSAPIServices, eSyaSMSAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaSMS_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaLocalizeAPIServices, eSyaLocalizeAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("SyaLocalize_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaConfigProductAPIServices, eSyaConfigProductAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaConfigProduct_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});

builder.Services.AddHttpClient<IeSyaFacilityAPIServices, eSyaFacilityAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaFacility_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});

builder.Services.AddHttpClient<IeSyaInventoryAPIServices, eSyaInventoryAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaInventory_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaEndUserAPIServices, eSyaEndUserAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaEndUser_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaAdminAPIServices, eSyaAdminAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaAdmin_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaManageServicesAPIServices, eSyaManageServicesAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaManageServices_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaStoreAPIServices, eSyaStoreAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaStore_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaConfigInventoryAPIServices, eSyaConfigInventoryAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaConfigInventory_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaManageRatesAPIServices, eSyaManageRatesAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaManageRates_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});
builder.Services.AddHttpClient<IeSyaVendorAPIServices, eSyaVendorAPIServices>(p =>
{
    p.BaseAddress = new Uri(builder.Configuration.GetValue<string>("eSyaVendor_API"));
    p.DefaultRequestHeaders.Add("dbContextType", builder.Configuration.GetValue<string>("dbContextType"));
    p.DefaultRequestHeaders.Add("Apikey", builder.Configuration.GetValue<string>("Apikey"));
    p.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue(Thread.CurrentThread.CurrentUICulture.ToString()));

});

builder.Services.AddSingleton<IUserAccountServices, UserAccountServices>();
builder.Services.AddSingleton<IPasswordPolicy, PasswordPolicy>();
builder.Services.AddSingleton<ISmsServices, SmsServices>();
builder.Services.AddSingleton<IApplicationRulesServices, ApplicationRulesServices>();
builder.Services.AddSingleton<IRazorpayClientServices, RazorpayClientServices>();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new List<CultureInfo>
    { 
        //new CultureInfo("en-IN"),
        new CultureInfo("en-US"),
        new CultureInfo("ar-EG")
    };

    options.DefaultRequestCulture = new RequestCulture("en-US");
    options.SupportedCultures = new List<CultureInfo> { new CultureInfo("en-US") };
    //options.DefaultRequestCulture = new RequestCulture("en-IN");
    //options.SupportedCultures = new List<CultureInfo> { new CultureInfo("en-IN") };

    options.SupportedUICultures=supportedCultures;
    options.RequestCultureProviders = new List<IRequestCultureProvider>
    {
        new QueryStringRequestCultureProvider(),
        new CookieRequestCultureProvider()
    };

});

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueCountLimit = int.MaxValue;  // 200 items max
                                             //  options.ValueLengthLimit = 1024 * 1024 * 100; // 100MB max len form data
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{

    options.UseSqlServer(builder.Configuration.GetConnectionString("dbConn_eSyaEnterprise"));

});

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
               .AddEntityFrameworkStores<ApplicationDbContext>()
               .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
}).
AddCookie(options => { options.LoginPath = "/Login"; });

builder.Services.AddSingleton<ViewBagActionFilter>();

builder.Services.AddSingleton<IStringLocalizerFactory, JsonStringLocalizerFactory>();

builder.Services.AddSingleton<IStringLocalizer, JsonDbContextStringLocalizer>();

//builder.Services.AddSingleton<IStringLocalizer, JsonStringUILocalizer>();



builder.Services.AddMvc()
               .AddSessionStateTempDataProvider();

builder.Services.AddMvc()

               .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix)
               .AddDataAnnotationsLocalization().
               AddNewtonsoftJson(options =>options.SerializerSettings.ContractResolver = new DefaultContractResolver());



builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();


var app = builder.Build();

// Enable the localization middleware
var localizeOptions = app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>();
var options = localizeOptions.Value;
app.UseRequestLocalization(options);

app.UseHttpsRedirection();
//app.UseStaticFiles();
app.UseSession();
app.UseAuthentication();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "MyArea",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Index}/{id?}");

app.Run();

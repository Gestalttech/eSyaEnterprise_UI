using eSyaEnterprise_UI.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Utility
{
    public interface IPasswordPolicy
    {
        ValidationResponse IsValidPasswordPolicy(string password);
    }

    public class PasswordPolicy: IPasswordPolicy
    {
        readonly IConfiguration configuration;
        private readonly DO_PasswordPolicy _passwordPolicy;
        public PasswordPolicy(IConfiguration iConfig, IOptions<DO_PasswordPolicy> option)
        {
            configuration = iConfig;
            _passwordPolicy = option.Value;
        }

        public ValidationResponse IsValidPasswordPolicy(string password)
        {
            var message = "The password does not meet the password policy requirements";

            if (!HasMinimumLength(password, _passwordPolicy.RequiredLength))
                return new ValidationResponse { Status = false, Message = message };
             if (_passwordPolicy.RequireUppercase > UpperCaseCount(password))
                return new ValidationResponse { Status = false, Message = message };
            if (_passwordPolicy.RequireLowercase > LowerCaseCount(password))
                return new ValidationResponse { Status = false, Message = message };
            if (_passwordPolicy.RequireNumeric > NumericCount(password))
                return new ValidationResponse { Status = false, Message = message };
            if (_passwordPolicy.RequireSpecialChar > SpecialCharCount(password))
                return new ValidationResponse { Status = false, Message = message };


            return new ValidationResponse { Status = true };
        }


        /// <summary>
        /// password policy
        /// </summary>
        public static ValidationResponse IsValidPasswordPolicy(string password, int requiredLength,
            int requiredUniqueChars,
            bool requireLowercase,
            bool requireUppercase,
            bool requireDigit,
            bool requireSpecialChar)
        {
            //   int len = configuration.GetValue<int>("razorpay:key");

            //int requiredLength = 8;
            //int requiredUniqueChars = 2;
            ////bool requireNonAlphanumeric = true;
            //bool requireLowercase = true;
            //bool requireUppercase = true;
            //bool requireDigit = true;
            //bool requireSpecialChar = true;
            //requiredLength = _config.GetValue<int>(
            //   "PasswordPolicy:RequiredLength");

            if (!HasMinimumLength(password, requiredLength))
                return new ValidationResponse { Status = false, Message = "The Minimum password lenght is " + requiredLength.ToString() };
            //if (!HasMinimumUniqueChars(password, requiredUniqueChars)) return new ValidationResponse { Status = false, Message = "The Minimum password lenght is "  };
            //if (requireNonAlphanumeric && !HasSpecialChar(password)) return false;
            if (requireLowercase && !HasLowerCaseLetter(password))
                return new ValidationResponse { Status = false, Message = "Must Contain at least 1 lowercase letter" };
            if (requireUppercase && !HasUpperCaseLetter(password))
                return new ValidationResponse { Status = false, Message = "Must Contain at least 1 uppercase letter" };
            if (requireDigit && !HasDigit(password))
                return new ValidationResponse { Status = false, Message = "Must Contain at least 1 number" };
            if (requireSpecialChar && !HasSpecialChar(password))
                return new ValidationResponse { Status = false, Message = "Must Contain at least 1 special character" };
            return new ValidationResponse { Status = true };
        }


        public static bool HasMinimumLength(string password, int minLength)
        {
            return password.Length >= minLength;
        }

        public static bool HasMinimumUniqueChars(string password, int minUniqueChars)
        {
            return password.Distinct().Count() >= minUniqueChars;
        }

        /// <summary>
        /// Returns TRUE if the password has at least one digit
        /// </summary>
        public static bool HasDigit(string password)
        {
            return password.Any(c => char.IsDigit(c));
        }

        /// <summary>
        /// Returns TRUE if the password has at least one special character
        /// </summary>
        public static bool HasSpecialChar(string password)
        {
            // return password.Any(c => char.IsPunctuation(c)) || password.Any(c => char.IsSeparator(c)) || password.Any(c => char.IsSymbol(c));
            return password.IndexOfAny("!@#$%^&*?_~-£().,".ToCharArray()) != -1;
        }

        /// <summary>
        /// Returns TRUE if the password has at least one uppercase letter
        /// </summary>
        public static bool HasUpperCaseLetter(string password)
        {
            return password.Any(c => char.IsUpper(c));
        }

        /// <summary>
        /// Returns TRUE if the password has at least one lowercase letter
        /// </summary>
        public static bool HasLowerCaseLetter(string password)
        {
            return password.Any(c => char.IsLower(c));
        }



        /// <summary>
        /// 
        /// </summary>
        private static int Minimum_Length = 7;
        private static int Upper_Case_length = 1;
        private static int Lower_Case_length = 1;
        private static int NonAlpha_length = 1;
        private static int Numeric_length = 1;
        private static int SpecialChar_length = 1;
        public static bool IsValid(string Password)
        {
            if (Password.Length < Minimum_Length)
                return false;
            if (UpperCaseCount(Password) < Upper_Case_length)
                return false;
            if (LowerCaseCount(Password) < Lower_Case_length)
                return false;
            if (NumericCount(Password) < Numeric_length)
                return false;
            if (NonAlphaCount(Password) < NonAlpha_length)
                return false;
            if (SpecialCharCount(Password) < SpecialChar_length)
                return false;
            return true;
        }
        private static int UpperCaseCount(string Password)
        {
            return Regex.Matches(Password, "[A-Z]").Count;
        }
        private static int LowerCaseCount(string Password)
        {
            return Regex.Matches(Password, "[a-z]").Count;
        }
        private static int NumericCount(string Password)
        {
            return Regex.Matches(Password, "[0-9]").Count;
        }
        private static int NonAlphaCount(string Password)
        {
            return Regex.Matches(Password, @"[^0-9a-zA-Z\._]").Count;
        }
        private static int SpecialCharCount(string Password)
        {
            return Regex.Matches(Password, @"[@#$%^&*_-]").Count;
        }

    }

    public class ValidationResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }
    }
}

namespace eSyaEnterprise_UI.Models
{
    public class DO_UserSecurityQuestions
    {
        public int UserId { get; set; }
        public int SecurityQuestionId { get; set; }
        public DateTime? EffectiveFrom { get; set; }
        public string SecurityAnswer { get; set; }
        public DateTime? EffectiveTill { get; set; }
        public bool ActiveStatus { get; set; }
        public string FormID { get; set; }
        public int CreatedBy { get; set; }
        public string TerminalID { get; set; }
        public bool IsSucceeded { get; set; }
        public string? Message { get; set; }
        public string? QuestionDesc { get; set; }
    }
}

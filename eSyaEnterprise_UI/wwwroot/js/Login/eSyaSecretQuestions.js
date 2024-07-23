function updateOptions() {

    // Get all select elements
    var selectElements = document.querySelectorAll('.selectpicker');

    // Create a set to track selected values
    var selectedValues = new Set();

    // Collect all selected values
    selectElements.forEach(function (selectElement) {
        if (selectElement.value !== "0") {
            selectedValues.add(selectElement.value);
        }
    });

    // Update options for each select element
    selectElements.forEach(function (selectElement) {
        var options = selectElement.querySelectorAll('option');
        options.forEach(function (option) {
            if (selectedValues.has(option.value) && option.value !== selectElement.value) {
                option.style.display = 'none'; // Hide the option
            } else {
                option.style.display = ''; // Show the option
            }
        });
        // Refresh the selectpicker to apply changes
        $(selectElement).selectpicker('refresh');
    });
}

// Initialize selectpickers on document ready
$(document).ready(function () {
    $('.selectpicker').selectpicker();
});
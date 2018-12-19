function ajaxProxy (ajaxUrl) {
    const self = this;
    this.ajaxUrl = ajaxUrl;  

    // -------------------------------------------
    // Method for populating table from json object
    // -------------------------------------------
    self.PopulateTable = function (populateHandler, handleError) {
        const lAjaxString = self.ajaxUrl;
        jQuery.ajax({                
            url: lAjaxString,
            type: 'GET',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        })
        .done(function (data) {
            populateHandler (data)
        })
        .fail(function (data) {
            handleError(data);
        });
    };
}